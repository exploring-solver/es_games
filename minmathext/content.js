// This script is automatically injected into every page
// You can add auto-detection logic here if you want the extension
// to automatically solve problems without clicking the button

console.log('Math Problem Solver extension is loaded and ready.');

// Optional: Auto-detection feature
// Uncomment the following code if you want the extension to automatically
// detect math problems when the page loads

/*
document.addEventListener('DOMContentLoaded', function() {
  // Check if the page has math problems
  const hasMathProblems = document.querySelectorAll('.math-problem').length > 0;
  
  if (hasMathProblems) {
    // Notify the user that math problems were detected
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.right = '10px';
    notification.style.padding = '10px';
    notification.style.backgroundColor = '#4285f4';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.textContent = 'Math problems detected! Click the extension icon to solve.';
    
    document.body.appendChild(notification);
    
    // Auto-hide the notification after 5 seconds
    setTimeout(() => {
      notification.style.display = 'none';
    }, 5000);
  }
});*/