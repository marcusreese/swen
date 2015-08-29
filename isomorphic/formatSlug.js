// /isomorphic/formatSlug

Iso.formatSlug = function formatSlug(args, inputKey, outputKey) {
  // Removes unwanted characters from url slug.
  "use strict";
  inputKey = inputKey || "roughSlug";
  outputKey = outputKey || "formattedSlug";
  var fixed = args[inputKey] || "",
      message = args.msgToUser || "";
  if (! inputKey in args) throw new Error("No input found.");
  if (fixed.match(/[^\w\-]/)) {
    message += "Web addresses generally use letters, numbers and hyphens.\n";
    message += "So the system is replacing /" + fixed;
    // /example-123 is okay, but not /@!$%^ (~+?=.\n";
    fixed = fixed.replace(/[^\w\-]+/g, "-");
    message += " with /" + fixed + ".\n";
  }
  if (fixed.match(/_/)) {
    message += "Underscores get lost or misunderstood sometimes.\n";
    message += "So the system is replacing /" + fixed;
    //message += "So /example-example/ is okay, but not /example_example/.\n";
    fixed = fixed.replace(/[^a-z0-9\-]+/g, " ");
    message += " with /" + fixed + ".\n";
  }
  if (fixed[0] === "-") {
    message += "A beginning hyphen has special meaning in this system.\n";
    message += "So the system is replacing /" + fixed;
    //message += "So /example-example/ is okay, but not /-example-example/.\n";
    fixed = fixed.slice(1);
    message += " with /" + fixed + ".\n";
  }
  if (fixed.slice(-1) === "-") {
    message += "An ending hyphen has special meaning in this system.\n";
    message += "So /example-example/ is okay, but not /example-example-/.\n";
    //message += "So the system is replacing /" + fixed;
    //fixed = fixed.slice(0, -1);
    //message += " with /" + fixed + ".\n";
  }
  if (fixed.match(/--+/)) {
    message += "Multiple hyphens have special meaning in this system.\n";
    message += "So the system is replacing /" + fixed;
    //message += "So /example-example/ is okay, but not /example--example/.\n";
    fixed = fixed.replace(/--+/g, "-");
    message += " with /" + fixed + ".\n";
  }
  if (fixed.match(/[A-Z]/)) {
    message += "Friendly web addresses generally use lowercase only.\n";
    message += "So the system is replacing /" + fixed;
    //message += "So /example-example/ is okay, but not /Example-EXAMPLE/.\n";
    fixed = fixed.toLowerCase();
    message += " with /" + fixed + ".\n";
  }
  if (fixed.match(/^[\s\-]*$/)) {
    message += "The address was all symbols.\n";
    message += "So the system is replacing /" + fixed;
    fixed = "symbols";
    message += " with /" + fixed + ".\n";
  }
  args[outputKey] = fixed;
  args.msgToUser = message;
  return fixed;
}
