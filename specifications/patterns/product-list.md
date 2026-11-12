# Liste de produits

Cet exemple compose Table, Badge, Button, TextField, DateRangePicker, Combobox, Drawer, Dialog et Toast pour
gérer un catalogue. Les données de démonstration restent en mémoire pendant la visite.

- Rechercher par nom, référence ou catégorie. La période porte sur la date d’ajout et
  inclut ses deux bornes. Une période incomplète ou inversée affiche une erreur et
  laisse la recherche textuelle active.
- Utiliser le Combobox pour ouvrir la fiche par nom ou référence, indépendamment des filtres du tableau.
- Trier les noms selon la langue de l’interface et les prix et dates selon leur valeur.
  Conserver les en-têtes pendant le chargement, les états vides et les erreurs.
- Ouvrir la fiche avec un bouton portant le nom du produit. Utiliser un Drawer modal à droite sur écran large et en bas sur écran étroit. À la fermeture, rendre le focus au produit ou à l’action d’ajout.
- Confirmer la suppression dans un dialogue destructif. Placer le focus initial sur
  Annuler et conserver la fiche si la confirmation est annulée.
- Confirmer les mutations avec un message bref dans une région de statut. Le toast ne déplace pas le focus à son ouverture et possède un bouton de fermeture accessible au clavier.
- Garder le tableau sur une surface opaque. Sur écran étroit, laisser le tableau
  défiler dans sa région nommée et conserver les filtres dans le flux de la page.

- Paginer après filtrage et tri. Revenir à la première page quand les filtres ou la taille de page changent. La sélection groupée se limite à la page affichée.
