// Create original data structure to save the data
function populateResults(testResults) {
  // Create an array to save each contributor with his/her
  // testCase and testSuite
  // Data Structure:
  // arr = [{
  //   "contr" : "abc@twitter.com",
  //   "levelCase": [{suite:"x", case:["x1", "x2", ...]}, ...],
  //   "testCaseCount": 7,
  //   "testCases": ["x1", "x2", "y1", ...],
  //   "testSuiteCount": 2,
  //   "testSuites": ["x", "y", ...]
  //   },
  //   {
  //   "contr" : "def@twitter.com",
  //   "levelCase": [{suite:"x", case:["x1", "x3", ...]}, ...],
  //   "testCaseCount": 5,
  //   "testCases": ["x1", "x3", "y2", ...],
  //   "testSuiteCount": 3,
  //   "testSuites": ["x", "y", ...]
  //   },
  //   ...
  // ]
  var arr = [];
  for (var testSuite in testResults) {
    var testSuiteData = testResults[testSuite];
    for (var testCase in testSuiteData['test_cases']) {
      testCaseFull = testSuite + '.' + testCase; // the whole name of testcase
      var testCaseData = testSuiteData['test_cases'][testCase];
      for (var i = 0; i < testCaseData['contributors'].length; i++) {
        var testCaseContr = testCaseData['contributors'][i];
        var flag = false;
        for (var j = 0; j < arr.length; j++) {
          if (arr[j].contr === testCaseContr) {
            flag = true;
            arr[j].testCases.push(testCaseFull);
            var len = arr[j].testSuites.length;
            if ((arr[j].testSuites)[len - 1] != testSuite) {
              arr[j].testSuites.push(testSuite);
            }
            break;
          }
        }
        if (!flag) {
          var obj = {
            contr: testCaseContr,
            testCases: [testCaseFull],
            testSuites: [testSuite]
          };
          arr.push(obj);
        }
      } // contributor, i
    } // testCase
  } // testSuite

  // Construct a level structure
  // and count the testcase/testsuite number of each contributor
  arr.forEach(function(value1) {
    value1.testCaseCount = (value1.testCases).length;
    value1.testSuiteCount = (value1.testSuites).length;
    var arrSuite = [];
    value1.testSuites.forEach(function(value2) {
      var arrayCase = [];
      value1.testCases.forEach(function(value3) {
        if (value3.indexOf(value2) > -1) {
          arrayCase.push(value3);
        }
      });
      var obj = {
        suite: value2,
        case: arrayCase
      };
      arrSuite.push(obj);
    });
    value1.levelCase = arrSuite;
  });
  return arr;
}

// Create a comparator to sort the arr[] by testcase count
function compare(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName];
    var value2 = object2[propertyName];
    if (value2 < value1) {
      return -1;
    } else if (value2 > value1) {
      return 1;
    } else {
      return 0;
    }
  }
}

// Show buttons of android test results and ios test results
// for user to pick one
function pickOs(boardType) {
  var errMsg = '<h3>Please select one mobile team: </h3>';
  errMsg += "<ul class='nav nav-pills'>";
  errMsg += "<li id = 'ios'><a href='" + boardType;
  errMsg += ".html?os=ios'>ios</a></li>";
  errMsg += "<li id = 'android'><a href='" + boardType;
  errMsg += ".html?os=android'>android</a></li></ul>";
  document.getElementById('content').innerHTML = errMsg;
}
