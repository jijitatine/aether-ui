# Liste de produits

Cet exemple compose Table, Badge, Button, TextField, DateRangePicker et Dialog pour
gérer un catalogue. Les données de démonstration restent en mémoire pendant la visite.

- Rechercher par nom, référence ou catégorie. La période porte sur la date d’ajout et
  inclut ses deux bornes. Une période incomplète ou inversée affiche une erreur et
  laisse la recherche textuelle active.
- Trier les noms selon la langue de l’interface et les prix et dates selon leur valeur.
  Conserver les en-têtes pendant le chargement, les états vides et les erreurs.
- Ouvrir la fiche avec un bouton portant le nom du produit. Utiliser un dialogue modal
  placé sur le bord de l’écran, avec une surface verre forte et un fond opaque de
  secours. À la fermeture, rendre le focus au produit ou à l’action d’ajout.
- Confirmer la suppression dans un dialogue destructif. Placer le focus initial sur
  Annuler et conserver la fiche si la confirmation est annulée.
- Confirmer les mutations avec un message bref dans une région de statut. Le toast
  reste hors du parcours de tabulation et ne déplace pas le focus.
- Garder le tableau sur une surface opaque. Sur écran étroit, laisser le tableau
  défiler dans sa région nommée et conserver les filtres dans le flux de la page.
