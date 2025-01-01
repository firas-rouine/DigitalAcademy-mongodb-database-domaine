const htmlElement = document.documentElement;
const storedTheme = localStorage.getItem('theme');

// Apply default or stored theme on page load
if (storedTheme) {
  htmlElement.setAttribute('data-bs-theme', storedTheme);
}

// Toggle theme on button click
buttonColorMode.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  htmlElement.setAttribute('data-bs-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});
