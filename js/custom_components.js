// Define the custom header component
class lttrfaceUIPanel extends HTMLElement {
    connectedCallback() {
      fetch('./components/lttrface-ui_panel.html')
        .then(response => response.text())
        .then(html => this.innerHTML = html)
        .catch(error => console.error('Error loading UI Panel:', error));
    }
  }
  
//   // Define the custom footer component
//   class CustomFooter extends HTMLElement {
//     connectedCallback() {
//       fetch('components/footer.html')
//         .then(response => response.text())
//         .then(html => this.innerHTML = html)
//         .catch(error => console.error('Error loading footer:', error));
//     }
//   }
  
  // Register the custom elements
  customElements.define('lttrface-ui-panel', lttrfaceUIPanel);
  