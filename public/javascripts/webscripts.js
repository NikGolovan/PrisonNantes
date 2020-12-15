/* Cette fonction contrôle la gestion de la barre latérale (fermeture/ouverture) */
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        var sideBarClosed = $('#sidebar').hasClass("active");
        if (!sideBarClosed) {
            $('#sidebarCollapse span').text('Fermer la barre latérale');
        } else {
            $('#sidebarCollapse span').text('Ouvrir la barre latérale');
        }
    });
});