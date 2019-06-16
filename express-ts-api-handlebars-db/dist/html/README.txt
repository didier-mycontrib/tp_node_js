le répertoire html comportera des pages statiques (sans interprétation coté seveur)
et des ressources associées (images , css, ...)
------
Ce répertoire peut éventuellement comportant le "dist" de tout un autre projet client/SPA (ex: appli angular)
Et une partie du code "js/client" de cette appli "SPA" pourra invoquer des Web Services REST de l'appli courante node
via XmlHttpRequest , jquery ou fetch .
