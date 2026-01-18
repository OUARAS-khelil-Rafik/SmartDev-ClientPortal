# 🔐 Gestion des Utilisateurs Admin

## Admin Par Défaut

Un utilisateur administrateur par défaut est automatiquement créé lors du premier démarrage du serveur.

### Credentials Admin Par Défaut

```
📧 Email: admin@novalis-ai.dev
🔑 Password: Novalis@2026
👤 Role: admin
```

## 🚀 Initialisation

### Option 1 : Automatique (Recommandé)

Au démarrage du serveur (`npm start`), l'application **crée automatiquement** l'utilisateur admin par défaut si la base de données est vide.

```bash
npm start
```

Vous verrez dans les logs :
```
🔐 Initializing default admin user...
📝 Creating default admin user...
✅ Default admin user created successfully!

📋 Admin Credentials:
   Email: admin@novalis-ai.dev
   Password: Novalis@2026
   Role: admin
```

### Option 2 : Script Dédié

Si vous voulez initialiser l'admin manuellement :

```bash
npm run init-admin
```

### Option 3 : Seeding Complet

Pour remplir la base de données avec des données d'exemple complètes :

```bash
npm run seed
```

Ce script créera :
- ✅ 5 utilisateurs (incluant 3 admins)
- ✅ 5 réservations d'exemple
- ✅ 5 consultations d'exemple
- ✅ 5 notifications d'exemple

## 📝 Fichiers Impliqués

### 1. `initialize-admin.js` 🆕
Script d'initialisation de l'admin par défaut. Peut être :
- Exécuté manuellement : `npm run init-admin`
- Importé dans d'autres modules
- Appelé automatiquement au démarrage

### 2. `seed.js` (Modifié)
Script de seeding avec l'admin par défaut en première position.

### 3. `index.js` (Modifié)
Appelle automatiquement `initializeDefaultAdmin()` au démarrage.

### 4. `package.json` (Modifié)
Ajout des scripts :
- `npm start` - Démarrer le serveur
- `npm run seed` - Seeder la base
- `npm run init-admin` - Initialiser l'admin

## 🔄 Workflow d'Initialisation

```
┌─────────────────────────────────────┐
│ npm start                           │
│ (Démarrage du serveur)              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ connectDB()                         │
│ (Connexion MongoDB)                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ initializeDefaultAdmin()            │
│ (Vérifier et créer admin)           │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    [Users] != 0  [Users] == 0
        │             │
        │             ▼
        │     Créer admin@novalis-ai.dev
        │             │
        └──────┬──────┘
               │
               ▼
    ✅ Serveur prêt (port 3002)
```

## 🔐 Se Connecter comme Admin

### Via l'API

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@novalis-ai.dev",
    "password": "Novalis@2026"
  }'
```

Réponse :
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "507f1f77bcf86cd799439011",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "admin@novalis-ai.dev",
    "firstName": "Admin",
    "lastName": "Novalis",
    "role": "admin"
  }
}
```

### Utiliser le Token pour Requêtes Admin

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Obtenir tous les utilisateurs
curl -X GET http://localhost:3002/api/user/admin/all \
  -H "Authorization: Bearer $TOKEN"

# Obtenir toutes les réservations
curl -X GET http://localhost:3002/api/booking/admin/all \
  -H "Authorization: Bearer $TOKEN"

# Diffuser une notification
curl -X POST http://localhost:3002/api/notifications/admin/broadcast \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "info",
    "title": "Bienvenue",
    "message": "Bienvenue sur SmartDev!"
  }'
```

## 📊 Vérification

### Vérifier que l'admin existe

```javascript
// Dans MongoDB Compass ou Shell
db.users.findOne({ email: "admin@novalis-ai.dev" })

// Résultat attendu:
{
  "_id": ObjectId("..."),
  "firstName": "Admin",
  "lastName": "Novalis",
  "email": "admin@novalis-ai.dev",
  "role": "admin",
  "isActive": true,
  "createdAt": ISODate("2026-01-18T..."),
  "updatedAt": ISODate("2026-01-18T...")
}
```

### Vérifier les utilisateurs

```bash
# Lister tous les utilisateurs (nécessite token admin)
curl -X GET http://localhost:3002/api/user/admin/all \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

## ⚠️ Points Importants

### Sécurité
- ✅ Le mot de passe est **haché avec bcrypt** dans la base de données
- ✅ Le mot de passe **ne s'affiche jamais** en clair
- ✅ Les tokens JWT **expirent après 7 jours**
- ✅ Les routes admin **nécessitent** le rôle `admin`

### Premier Démarrage
- Si la base est **vide** → Admin créé automatiquement
- Si la base a **des users** → Admin non créé
- Vous pouvez créer manuellement : `npm run init-admin`

### Réinitialisation
Si vous voulez recommencer avec des données vierges :

```bash
# 1. Supprimer les collections
# (Via MongoDB Compass ou CLI)

# 2. Redémarrer le serveur
npm start
# → Admin sera créé automatiquement
```

## 🎯 Routes Admin Disponibles

Après connexion en tant qu'admin, vous avez accès à :

```
# Utilisateurs
GET    /api/user/admin/all
GET    /api/user/admin/:id
PUT    /api/user/admin/:id
DELETE /api/user/admin/:id

# Réservations
GET    /api/booking/admin/all
GET    /api/booking/admin/:id
PUT    /api/booking/admin/:id
DELETE /api/booking/admin/:id

# Consultations
GET    /api/consultation/admin/all
GET    /api/consultation/admin/:id
PUT    /api/consultation/admin/:id
DELETE /api/consultation/admin/:id

# Notifications
POST   /api/notifications/admin/create
POST   /api/notifications/admin/broadcast
GET    /api/notifications/admin/all
DELETE /api/notifications/admin/:id
```

## 📚 Voir Aussi

- 📄 `server/API_DOCUMENTATION.md` - Documentation API complète
- 📄 `QUICK_START.md` - Guide de démarrage rapide
- 📄 `initialize-admin.js` - Code du script d'initialisation
- 📄 `seed.js` - Code du script de seeding

---

**Créé le** : 18 janvier 2026  
**Status** : ✅ Opérationnel  
**Admin créé automatiquement** : Oui
