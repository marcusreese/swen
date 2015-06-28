// I don't remember the details, but the following was used on 'End of Code'. 
function runCode($scope) { 
        var arr = $scope.lines; 
        var code = ""; 
        // Don't use the newest or the "end..code" line. 
        for (var i = arr.length -3; i > 0; i--) { 
                // Only since the latest "code:". 
                if (arr[i].text.match(/code:/i)) break; 
                else code = arr[i].text + code; 
        } 
        if (code) { 
console.log(code) 
                bash(code); 
        } 
} 
 
function log(error, result) { 
        if (error) console.log('myError: ' + error); 
        else console.log(result); 
} 
// The following is not for production, of course. 
// It allows browser console to run arbitrary bash code on server. 
bash = function(script) { 
        Meteor.call('bash', script, log); 
} 

