function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("collapsed");
}

function setActive(element) {
    const menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach(item => {
        item.classList.remove("active");
    });
    element.classList.add("active");
}

function handleLogout() {
    alert("You have logged out successfully.");
}