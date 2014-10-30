require 'sinatra'
require 'httparty'
require 'json'

TEST_API_ANDROID_URL = "https://mobile-ci.twitter.biz/view/Android/job/twitter-android-ui-tests/api/json?pretty=true"
TEST_API_IOS_URL = "https://mobile-ci.twitter.biz/job/twitter-ios-master-subliminal/api/json?pretty=true"
TEST_SUITE_URL = "%{build}artifact/scripts/mobile-test-reporting/artifacts/testsuites.json"
# num of builds to loop should be fewer than 50 since builds before that are deleted automatically
NUM = 50

# render views/index.erb
get '/' do
  erb :index
end

# render android_tests.json file
get '/android_tests.json' do
  res_android = get_test_suite('android')
  res_android.body
end

# render ios_tests.json file
get '/ios_tests.json' do
  res_ios = get_test_suite('ios')
  res_ios.body
end

def get_test_suite(os)
  # fetch REST API json file depending on whether it is android or ios
  if os == 'android'
    api = HTTParty.get(TEST_API_ANDROID_URL)
  else
    api = HTTParty.get(TEST_API_IOS_URL)
  end
  # parse REST API
  jparse = JSON.parse(api.body)
  # fetch testsuite json file
  # find part of url bd including the BUILD number
  # res is target testsuite json file
  j = 0;
  bd = jparse['builds'][j]['url']
  res = HTTParty.get(TEST_SUITE_URL % {build: bd})
  # first one in REST API may not have artifacts
  # so we need to loop until we find one available
  while res.code == 404 && j < NUM
    bd = jparse['builds'][j]['url']
    res = HTTParty.get(TEST_SUITE_URL % {build: bd})
    j += 1
  end
  puts(bd)
  return res
end

