# Créer la structure des dossiers
$folders = @(
    "src\api\Admin",
    "src\api\Categorie",
    "src\api\Chart",
    "src\api\Client",
    "src\api\Commande",
    "src\api\Produit",
    "src\components\Complements",
    "src\components\DashBoard",
    "src\components\Produit",
    "src\components\User",
    "src\context",
    "src\pages\Admin",
    "src\utils"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder
}

# Créer les fichiers API
$apiFiles = @(
    "src\api\apiClient.ts",
    "src\api\Admin\adminApi.ts",
    "src\api\Categorie\categorieApi.ts",
    "src\api\Chart\chartApi.ts",
    "src\api\Client\clientApi.ts",
    "src\api\Commande\commandeApi.ts",
    "src\api\Produit\produitApi.ts"
)

# Créer les fichiers Context
$contextFiles = @(
    "src\context\AuthContext.tsx",
    "src\context\CartContext.tsx",
    "src\context\ToastContext.tsx"
)

# Créer les fichiers Components
$componentFiles = @(
    "src\components\Complements\Badge.tsx",
    "src\components\Complements\Button.tsx",
    "src\components\Complements\Card.tsx",
    "src\components\Complements\ConfirmDialog.tsx",
    "src\components\Complements\EmptyState.tsx",
    "src\components\Complements\Footer.tsx",
    "src\components\Complements\Header.tsx",
    "src\components\Complements\Loading.tsx",
    "src\components\Complements\Modal.tsx",
    "src\components\Complements\Toast.tsx",
    "src\components\DashBoard\StatCard.tsx",
    "src\components\Produit\ProductCard.tsx",
    "src\components\User\FormConnexion.tsx",
    "src\components\User\FormInscription.tsx"
)

# Créer les fichiers Pages
$pageFiles = @(
    "src\pages\Accueil.page.tsx",
    "src\pages\Connexion.page.tsx",
    "src\pages\Inscription.page.tsx",
    "src\pages\Produits.page.tsx",
    "src\pages\ProduitDetail.page.tsx",
    "src\pages\Panier.page.tsx",
    "src\pages\Commandes.page.tsx",
    "src\pages\CommandeDetail.page.tsx",
    "src\pages\NotFound.page.tsx",
    "src\pages\Admin\Dashboard.page.tsx",
    "src\pages\Admin\ProduitsAdmin.page.tsx",
    "src\pages\Admin\CreateProduit.page.tsx",
    "src\pages\Admin\EditProduit.page.tsx",
    "src\pages\Admin\CategoriesAdmin.page.tsx",
    "src\pages\Admin\CommandesAdmin.page.tsx",
    "src\pages\Admin\ClientsAdmin.page.tsx"
)

# Créer les fichiers Utils
$utilFiles = @(
    "src\utils\PrivateRoute.tsx"
)

# Créer tous les fichiers
$allFiles = $apiFiles + $contextFiles + $componentFiles + $pageFiles + $utilFiles

foreach ($file in $allFiles) {
    New-Item -ItemType File -Force -Path $file
}

Write-Host "Structure créée avec succès!" -ForegroundColor Green