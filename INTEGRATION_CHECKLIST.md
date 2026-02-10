# 🎯 Checklist d'Intégration Frontend-Backend

## ✅ Fait - Modifications Appliquées

### 1. **Authentification JWT**
- [x] Ajout de `verifyCode()` dans AuthContext pour le flow sign up → verify code
- [x] Token automatiquement stocké en localStorage après login/verifyCode
- [x] Token automatiquement envoyé dans les headers `Authorization: Bearer`
- [x] Déconnexion : suppression du token et redirection
- [x] Pages protégées via `<PrivateRoute>` et `<PrivateRoute adminOnly>`

### 2. **API Client Centralisé**
- [x] `src/api/apiClient.ts` : gestion centralisée des requêtes
- [x] Support des env variables `VITE_API_BASE_URL` et `VITE_API_USE_CREDENTIALS`
- [x] Détection automatique FormData vs JSON
- [x] Support des 204 No Content

### 3. **Modules API Adaptés**
- [x] `produitApi.ts` → endpoints RESTful `/api/produits`
- [x] `categorieApi.ts` → endpoints RESTful `/api/category`
- [x] `clientApi.ts` → ajout `verifyCode()`
- [x] `adminApi.ts` → ajout `verifyCode()`
- [x] `commandeApi.ts` → endpoints RESTful `/api/orders`

### 4. **Pages Mises à Jour**
- [x] `Inscription.page.tsx` → utilise `verifyCode()` du context
- [x] `Connexion.page.tsx` → login standard avec stockage token
- [x] `App.tsx` → `<PrivateRoute>` wrapper sur pages protégées
- [x] `Header.tsx` → affiche bouton déconnexion

### 5. **Configuration**
- [x] `.env` créé avec URL backend
- [x] `.env.example` créé comme template
- [x] `BACKEND_INTEGRATION.md` créé (documentation complète)

---

## 📋 À Tester Localement

### Prérequis
- Backend en cours d'exécution sur `http://127.0.0.1:5000`
- Frontend en cours d'exécution sur `http://127.0.0.1:5173`

### Test Flow Utilisateur Client
```
1. Ouvrir http://127.0.0.1:5173/inscription
2. Remplir formulaire (nom, prénom, email, password, téléphone)
3. Cliquer "S'inscrire"
4. Entrer code reçu par email (check backend logs ou mailer)
5. Cliquer "Vérifier"
6. Redirection automatique vers / (accueil)
7. Vérifier token dans localStorage: F12 → Application → localStorage
8. Cliquer "Déconnexion" en haut
9. Redirection vers /connexion
10. Vérifier token supprimé de localStorage
```

### Test Login Direct
```
1. Ouvrir http://127.0.0.1:5173/connexion
2. Entrer un email/password d'un utilisateur existant
3. Cliquer "Se connecter"
4. Token auto-stocké
5. Redirection vers accueil
```

### Test Pages Protégées
```
1. Ouvrir http://127.0.0.1:5173/produits (sans être connecté)
   → Devrait rediriger vers /connexion
2. Se connecter
3. Ouvrir http://127.0.0.1:5173/produits
   → Devrait afficher les produits depuis /api/produits
```

### Test Admin
```
1. S'inscrire avec checkbox "Admin"
2. Vérifier code
3. Cliquer sur "Dashboard" en haut du header
4. Vérifier redirection vers /admin/dashboard
```

---

## 🚨 Problèmes Potentiels & Solutions

### CORS Issues
**Symptôme**: `Access to XMLHttpRequest... blocked by CORS`
**Solution**: Vérifier que backend a CORS activé:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Token Non Envoyé
**Symptôme**: Les requêtes API retournent 401 Unauthorized
**Solutions**:
- Vérifier `localStorage` contient le token (F12 → Application)
- Vérifier que `apiClient.request()` inclut le token dans les headers
- Vérifier backend attend `Authorization: Bearer <token>` (ou cookies)

### Erreur "Route /connexion non trouvée"
**Cause**: L'app est un SPA custom (pas react-router)
**Solution**: Routes sont dans `App.tsx` → `renderPage()`
- Vérifier les chemins dans le `navigate()` function

### Email Code Non Reçu
**Symptôme**: Après inscription, pas d'email avec code
**Vérifier**:
1. Backend logs pour voir si `await mail()` a été appelé
2. Configuration SMTP du backend (`.env` du backend)
3. Check la console backend pour le code imprimé (logs)

---

## 🔧 Ajustements Possibles

### Si le backend utilise des champs différents
Exemple: Si le backend retourne `{ _id: userId, accessToken: token }` au lieu de `{ user: userId, token: token }`:
- Modifier `AuthContext.tsx` dans les catch login/verifyCode pour extraire les bons champs

### Si le backend envoie des réponses différentes
Exemple: Si `/api/produits` retourne `{ success: true, data: [...] }` au lieu de `[...]`:
- Adapter les pages qui utilisent les résultats: `setProducts(data.data || [])`

### Si certification HTTPS est requise
- Ajouter `VITE_API_BASE_URL=https://...` dans `.env`
- Changer `VITE_API_USE_CREDENTIALS=false` si HTTPS auto-manage

---

## 📦 Build Production

```bash
# Frontend
npm run build
npm run preview

# Output: dist/
# Deploy: dist/ vers serveur (Vercel, Netlify, etc.)
```

---

## 💬 Support

Si vous avez des questions sur les changements effectués:
1. Consultez `BACKEND_INTEGRATION.md` pour le flow complet
2. Vérifier les logs du navigateur (F12) et du backend
3. Vérifier la connexion réseau dans F12 → Network

