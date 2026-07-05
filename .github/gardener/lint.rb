#!/usr/bin/env ruby
# frozen_string_literal: true
#
# lint.rb — deterministic content gate for the Gardener (and a good gate for any
# content PR). Validates _data/stories.yml and _data/wordgames.yml against the
# project's hard rules. Exits non-zero with a readable report on any violation,
# so a red check blocks the merge.
#
# Checks:
#   1. YAML parses.
#   2. ids unique within each file.
#   3. every `art:` key exists in assets/js/art.js.
#   4. every `skills:` entry is one of the Galinsky-7.
#   5. every `age_band:` entry is one of the 5 bands.
#   6. no banned framing / scolding language in read-aloud strings.
#   7. no obvious PII (email / phone) in read-aloud strings.
#
# Read-only. Run: `ruby .github/gardener/lint.rb`

require "yaml"

ROOT   = File.expand_path("../..", __dir__)
BANDS  = %w[6-12m 12-24m 2-3y 3-4y 4-5y].freeze
SKILLS = %w[focus perspective communicating connections
            critical-thinking challenges self-directed].freeze

# Framing this project refuses (case-insensitive, whole word). Book *titles* in
# the KB may say "scientist" — but these checks only ever scan content STRING
# VALUES in _data/*.yml (lines/cues/labels/titles), never comments or the KB,
# so titles like "The Scientist in the Crib" are never seen here.
BANNED_FRAMING = /\b(experiment|scientist|hypothesis|quiz|test\s+her|test\s+him)\b/i
SCOLDING       = /\b(stupid|naughty|bad\s+(girl|boy)|shut\s+up|wrong!|no,?\s+bad)\b/i
EMAIL          = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
PHONE          = /(?<!\d)(?:\+?\d[\d\s().-]{8,}\d)(?!\d)/

errors = []

def art_keys
  path = File.join(ROOT, "assets/js/art.js")
  keys = []
  File.foreach(path) do |line|
    m = line.match(/^\s+([a-z0-9_]+):\s*(.)/)
    keys << m[1] if m && m[2] == "`"   # an art entry is `key:` + a template literal
  end
  keys
end

def load_list(path)
  full = File.join(ROOT, path)
  return [] unless File.exist?(full)
  YAML.safe_load(File.read(full), permitted_classes: [], aliases: false) || []
end

ART = art_keys
if ART.empty?
  errors << "could not read any art keys from assets/js/art.js"
end

# strings a child hears / a grown-up reads — the only text we scan for framing/PII
def content_strings(item)
  out = []
  out << item["title"] if item["title"]
  Array(item["pages"]).each do |p|
    next unless p.is_a?(Hash)
    out << p["line"] if p["line"]
    out << p["cue"]  if p["cue"]
  end
  Array(item["items"]).each do |it|
    out << it["label"] if it.is_a?(Hash) && it["label"]
  end
  out.compact
end

{ "stories" => "_data/stories.yml", "games" => "_data/wordgames.yml" }.each do |kind, path|
  begin
    list = load_list(path)
  rescue => e
    errors << "#{path}: YAML failed to parse — #{e.message}"
    next
  end

  seen = {}
  list.each_with_index do |item, i|
    unless item.is_a?(Hash)
      errors << "#{path}[#{i}]: entry is not a mapping"
      next
    end
    id = item["id"]
    if id.nil? || id.to_s.strip.empty?
      errors << "#{path}[#{i}]: missing id"
    elsif seen[id]
      errors << "#{path}: duplicate id '#{id}'"
    else
      seen[id] = true
    end
    where = "#{path} (#{id || "[#{i}]"})"

    Array(item["age_band"]).each do |b|
      errors << "#{where}: unknown age_band '#{b}' (allowed: #{BANDS.join(', ')})" unless BANDS.include?(b)
    end
    Array(item["skills"]).each do |s|
      errors << "#{where}: unknown skill '#{s}' (allowed: #{SKILLS.join(', ')})" unless SKILLS.include?(s)
    end

    # art keys — pages (stories) and items (games)
    (Array(item["pages"]) + Array(item["items"])).each do |node|
      next unless node.is_a?(Hash) && node["art"]
      unless ART.include?(node["art"])
        errors << "#{where}: art key '#{node['art']}' does not exist in assets/js/art.js"
      end
    end

    content_strings(item).each do |str|
      if (m = str.match(BANNED_FRAMING))
        errors << "#{where}: banned framing '#{m[0]}' in \"#{str}\""
      end
      if (m = str.match(SCOLDING))
        errors << "#{where}: scolding language '#{m[0]}' in \"#{str}\""
      end
      if str.match(EMAIL)
        errors << "#{where}: looks like an email address in \"#{str}\""
      end
      if str.match(PHONE)
        errors << "#{where}: looks like a phone number in \"#{str}\""
      end
    end
  end
end

if errors.empty?
  puts "gardener-lint: OK — content library passes all checks (art keys: #{ART.size})."
  exit 0
else
  warn "gardener-lint: #{errors.size} problem(s) found:\n"
  errors.each { |e| warn "  ✗ #{e}" }
  warn "\nA red check blocks the merge. Fix the content or close the PR."
  exit 1
end
