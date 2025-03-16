document.addEventListener('DOMContentLoaded', function() {
    console.log('Extension loaded and DOM content is ready');
  
    document.getElementById('solveButton').addEventListener('click', function() {
      console.log('Solve button clicked');
  
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log('Active tab info:', tabs[0]);
  
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: solveMathProblems
        }, function(results) {
          console.log('Script execution results:', results);
          document.getElementById('status').textContent = 'Math problems solved!';
        });
      });
    });
  });
  
  // This entire function will be injected into the page
  function solveMathProblems() {
    console.log('Executing solveMathProblems function');
  
    // Internal helper function - defined inside solveMathProblems to ensure it's available
    function evaluateExpression(num1, operator, num2) {
      console.log(`Evaluating expression: ${num1} ${operator} ${num2}`);
      console.log(`Operator character code: ${operator.charCodeAt(0)}`);
      
      num1 = parseFloat(num1);
      num2 = parseFloat(num2);
      
      // Check character code directly for multiplication symbol (×)
      // ASCII 215 is the multiplication symbol ×
      if (operator.charCodeAt(0) === 215 || operator === 'x' || operator === '*') {
        console.log('Performing multiplication');
        return num1 * num2;
      }
      
      switch(operator) {
        case '+':
          return num1 + num2;
        case '-':
          return num1 - num2;
        case '÷':
        case '/':
          if (num2 === 0) {
            console.warn('Division by zero detected');
            return 'Error';
          }
          return num1 / num2;
        default:
          console.error(`Unknown operator: ${operator} (charCode: ${operator.charCodeAt(0)})`);
          return 'Error';
      }
    }
  
    // Main function code
    const mathGroups = document.querySelectorAll('.math-problem, .math-operator');
    const inputs = document.querySelectorAll('input[data-slot="input"]');
    
    console.log(`Found ${mathGroups.length} math groups`);
    console.log(`Found ${inputs.length} input fields`);
  
    if (mathGroups.length === 0 || inputs.length === 0) {
      console.warn('No math problems or input fields found on this page.');
      alert('No math problems or input fields found on this page.');
      return;
    }
    
    // Create an array to hold the expressions
    let expressions = [];
    let currentExpression = [];
    
    // Group the math problems and operators into expressions
    for (let i = 0; i < mathGroups.length; i++) {
      const element = mathGroups[i];
      currentExpression.push(element.textContent.trim());
      
      // If we have a complete expression (number, operator, number)
      if (currentExpression.length === 3) {
        console.log(`Collected expression: ${currentExpression.join(' ')}`);
        expressions.push(currentExpression);
        currentExpression = [];
      }
    }
    
    console.log(`Total expressions to solve: ${expressions.length}`);
    
    // Solve each expression and fill in the corresponding input
    expressions.forEach((expr, index) => {
      if (index < inputs.length) {
        const result = evaluateExpression(expr[0], expr[1], expr[2]);
        console.log(`Expression: ${expr.join(' ')} = ${result}`);
        
        inputs[index].value = result;
        
        // Trigger an input event to notify the page of the change
        const event = new Event('input', { bubbles: true });
        inputs[index].dispatchEvent(event);
        
        // Also dispatch a change event for good measure
        const changeEvent = new Event('change', { bubbles: true });
        inputs[index].dispatchEvent(changeEvent);
      }
    });
    
    console.log(`Solved ${expressions.length} math problems`);
    return `Solved ${expressions.length} math problems`;
  }