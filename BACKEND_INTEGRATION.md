# Intégration Backend - Frontend E-COM

## 📋 Flux d'Authentification (JWT)

### 1. **Inscription (Sign Up)**
```
POST /api/client/register (ou /api/admin/register)
Body: { nom, prenom, email, password, number, code? }
Response: { user: {...}, message: "Un code de vérification..." }
→ Email envoyé avec code à 6 chiffres
```

### 2. **Vérification Code**
```
POST /api/client/verify/:email (ou /api/admin/verify/:email)
Body: { code: "123456" }
Response: { user: userId, token: "eyJhbGc..." }
→ Token stocké dans localStorage
→ Utilisateur redirigé vers dashboard/accueil
```

### 3. **Connexion (Sign In)**
```
POST /api/client/login (ou /api/admin/login)
Body: { email, password }
Response: { user: userId, token: "eyJhbGc..." }
→ Token stocké dans localStorage
```

### 4. **Déconnexion (Logout)**
```
GET /api/client/logout (ou /api/admin/logout)
→ Token supprimé de localStorage
→ Redirection vers /connexion
```

---

## 🔑 Token Management

- **Storage**: `localStorage.getItem('token')`
- **Envoi**: Automatique via `Authorization: Bearer <token>` dans tous les appels API
- **Suppression**: Automatique au logout

---

## 📡 Endpoints API Utilisés

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/produits` | Tous les produits |
| GET | `/api/produits/:id` | Un produit |
| GET | `/api/produits/search?q=...` | Rechercher |
| GET | `/api/produits/popular` | Populaires |
| GET | `/api/produits/new` | Nouveaux |
| GET | `/api/produits/category/:id` | Par catégorie |
| POST | `/api/produits` | Créer (admin) |
| PUT | `/api/produits/:id` | Modifier (admin) |
| DELETE | `/api/produits/:id` | Supprimer (admin) |
| POST | `/api/produits/uploadImage` | Upload image |

### Catégories
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/category` | Toutes les catégories |
| GET | `/api/category/:id` | Une catégorie |
| POST | `/api/category` | Créer |
| PUT | `/api/category/:id` | Modifier |
| DELETE | `/api/category/:id` | Supprimer |

### Commandes
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/orders` | Toutes |
| GET | `/api/orders/:id` | Une commande |
| GET | `/api/orders/user/:email` | Par client |
| POST | `/api/orders/create` | Créer une |
| POST | `/api/orders/cart/create` | Panier complet |
| PUT | `/api/orders/:id/status` | Changer statut |
| PUT | `/api/orders/:id/cancel` | Annuler |
| GET | `/api/orders/stats/overview` | Statistiques |

---

## 🚀 Configuration Locale

### `.env` (copier depuis `.env.example`)
```
VITE_API_BASE_URL=http://127.0.0.1:5000/api
VITE_API_USE_CREDENTIALS=true
```

### Lancer le serveur frontend
```bash
npm install
npm run dev
# → http://localhost:5173/
```

### Lancer le serveur backend
```bash
# Dans le dossier backend
npm install
npm run dev
# → http://localhost:5000/api
```

---

## 🔐 Sécurité

- ✅ Token JWT stocké en localStorage
- ✅ Token envoyé automatiquement dans `Authorization: Bearer`
- ✅ Cookies HTTP-Only possibles via `credentials: 'include'`
- ✅ Routes protégées via `<PrivateRoute>`
- ✅ Admin routes via `<PrivateRoute adminOnly>`

---

## 📝 Fichiers Modifiés

### Context & Auth
- `src/context/AuthContext.tsx` - Ajout `verifyCode()`, token localStorage
- `src/api/apiClient.ts` - Token Bearer, env config

### Pages
- `src/pages/Inscription.page.tsx` - Utilise `verifyCode()` du context
- `src/pages/Connexion.page.tsx` - Login classique
- `src/App.tsx` - PrivateRoute wrapper

### API Modules
- `src/api/Produit/produitApi.ts` - Routes RESTful
- `src/api/Categorie/categorieApi.ts` - Routes RESTful
- `src/api/Client/clientApi.ts` - Ajout `verifyCode()`
- `src/api/Admin/adminApi.ts` - Ajout `verifyCode()`
- `src/api/Commande/commandeApi.ts` - Routes RESTful

---

## 🧪 Test du Flow

1. **Inscrivez-vous** → `http://localhost:5173/inscription`
   - Remplissez le formulaire
   - Recevez un code email
   - Entrez le code
   - Token auto-stocké

2. **Naviguez** → Les pages sont protégées
   - Sans token → redirection vers `/connexion`

3. **Connectez-vous** → `http://localhost:5173/connexion`
   - Email + Mot de passe
   - Token reçu et stocké
   - Accès à toutes les pages

4. **Déconnectez-vous** → Bouton en haut du Header
   - Token supprimé
   - Redirection vers `/connexion`

---

## ⚠️ Notes Importantes

- Le backend envoie les cookies JWT avec `res.cookie('jwt', token, { httpOnly, sameSite: 'lax' })`
- Le frontend stocke aussi un token en localStorage comme fallback
- Les deux mécanismes coexistent pour maximum de compatibilité
- CORS configuré pour `http://localhost:5173` et `localhost:3000`

