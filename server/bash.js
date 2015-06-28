var Future = Npm.require('fibers/future');
Meteor.methods({
        bash: function(script) {
                script = "cd /Users/marcusreese/Projects/; " + script;
                var future = new Future();
                var exec = Npm.require('child_process').exec;
                exec(script, function(error, stdout, stderr) {
                        var results = error ? error.toString() : stdout;
                        future["return"](results)
                });
                return future.wait();
        }
});
