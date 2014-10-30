# Sync with stdout
# http://stackoverflow.com/questions/9953435/why-does-foreman-not-output-some-things-until-i-press-control-c
$stdout.sync = true

require 'rufus/scheduler'

scheduler = Rufus::Scheduler.new

# Run this test every minute...
scheduler.every '60s' do
  puts "chad: #{Time.now}"
end

scheduler.join # let the current thread join the scheduler thread