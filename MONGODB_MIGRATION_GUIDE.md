# 🚀 Guide de Migration MongoDB - SmartDev Client Portal

## ✅ Modifications Effectuées

Toutes les opérations CRUD (Create, Read, Update, Delete) pour les **Users**, **Bookings**, **Consultations**, et **Notifications** sont maintenant connectées à **MongoDB Atlas**.

### 📋 Résumé des Changements

#### 1. **Middleware d'Authentification** ✨
- ✅ Ajout de la vérification du rôle utilisateur depuis MongoDB
- ✅ Nouveau middleware `requireAdmin` pour les routes admin
- ✅ Le middleware `authenticate` récupère maintenant l'utilisateur complet depuis MongoDB

**Fichier modifié:** `server/middleware/auth.js`

#### 2. **Routes Utilisateurs (Users)** 👤
- ✅ GET `/api/user/admin/all` - Liste tous les utilisateurs (admin)
- ✅ GET `/api/user/admin/:id` - Récupère un utilisateur par ID (admin)
- ✅ PUT `/api/user/admin/:id` - Modifie un utilisateur (admin)
- ✅ DELETE `/api/user/admin/:id` - Supprime un utilisateur (admin)

**Fichier modifié:** `server/routes/user.js`

#### 3. **Routes Bookings (Réservations)** 📅
- ✅ GET `/api/booking/admin/all` - Liste toutes les réservations (admin)
- ✅ GET `/api/booking/admin/:id` - Récupère une réservation par ID (admin)
- ✅ PUT `/api/booking/admin/:id` - Modifie une réservation (admin)
- ✅ DELETE `/api/booking/admin/:id` - Supprime une réservation (admin)

**Fichier modifié:** `server/routes/booking.js`

#### 4. **Routes Consultations** 💬
- ✅ GET `/api/consultation/admin/all` - Liste toutes les consultations (admin)
- ✅ GET `/api/consultation/admin/:id` - Récupère une consultation par ID (admin)
- ✅ PUT `/api/consultation/admin/:id` - Modifie une consultation (admin)
- ✅ DELETE `/api/consultation/admin/:id` - Supprime une consultation (admin)

**Fichier modifié:** `server/routes/consultation.js`

#### 5. **Routes Notifications** 🔔
- ✅ POST `/api/notifications/admin/create` - Crée une notification pour un utilisateur (admin)
- ✅ POST `/api/notifications/admin/broadcast` - Diffuse une notification à tous les utilisateurs (admin)
- ✅ GET `/api/notifications/admin/all` - Liste toutes les notifications (admin)
- ✅ DELETE `/api/notifications/admin/:id` - Supprime une notification (admin)

**Fichier modifié:** `server/routes/notification.js`

#### 6. **Modèle Notification** 🔧
- ✅ Ajout des types `info`, `success`, `warning`, `error` au modèle

**Fichier modifié:** `server/models/Notification.js`

---

## 📚 Nouveaux Fichiers Créés

### 1. Documentation API
**Fichier:** `server/API_DOCUMENTATION.md`
- Documentation complète de toutes les routes
- Exemples de requêtes
- Formats de réponse
- Guide d'utilisation

### 2. Script de Test
**Fichier:** `server/test-mongodb-api.sh`
- Script bash pour tester toutes les routes
- Création automatique de données de test
- Vérification de la connexion MongoDB

---

## 🎯 Fonctionnalités Clés

### Pour les Utilisateurs Normaux

1. **Gestion du Profil**
   - Consulter son profil
   - Modifier ses informations
   - Supprimer son compte

2. **Réservations (Bookings)**
   - Créer des réservations
   - Consulter ses réservations
   - Modifier ses réservations
   - Annuler ses réservations

3. **Consultations**
   - Démarrer une consultation AI
   - Historique de conversations sauvegardé

4. **Notifications**
   - Recevoir des notifications
   - Marquer comme lu
   - Supprimer des notifications

### Pour les Administrateurs 🔑

1. **Gestion des Utilisateurs**
   - Liste complète avec pagination
   - Recherche par nom/email
   - Filtrage par rôle et statut
   - Modification de n'importe quel utilisateur
   - Suppression d'utilisateurs

2. **Gestion des Réservations**
   - Vue d'ensemble de toutes les réservations
   - Filtrage par statut et service
   - Modification du statut
   - Suppression de réservations

3. **Gestion des Consultations**
   - Accès à toutes les consultations
   - Filtrage par type de projet
   - Mise à jour des informations
   - Archivage

4. **Gestion des Notifications**
   - Créer des notifications ciblées
   - Diffusion de notifications à tous les utilisateurs
   - Vue d'ensemble de toutes les notifications
   - Suppression

---

## 🔧 Configuration

### Variables d'Environnement Requises

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smartdev?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_very_secure_secret_key_change_this

# Server Configuration
PORT=3003
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Gemini API (pour les consultations AI)
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 Démarrage Rapide

### 1. Installer les Dépendances

```bash
cd server
npm install
```

### 2. Configurer l'Environnement

Créer un fichier `.env.local` à la racine du projet avec les variables ci-dessus.

### 3. Démarrer le Serveur

```bash
cd server
npm start
```

Le serveur démarre sur `http://localhost:3003`

### 4. Tester l'API

```bash
cd server
./test-mongodb-api.sh
```

---

## 📊 Structure de la Base de Données MongoDB

### Collection: users
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  company: String,
  role: "user" | "admin",
  avatar: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: bookings
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  serviceName: String,
  title: String,
  description: String,
  budget: Number,
  timeline: String,
  preferredStartDate: Date,
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled",
  attachments: Array,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: consultations
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, optional),
  email: String,
  name: String,
  projectType: "Web" | "Mobile" | "AI" | "Cloud" | "Other",
  description: String,
  budget: String,
  timeline: String,
  conversationHistory: Array,
  status: "active" | "completed" | "archived",
  createdAt: Date,
  updatedAt: Date
}
```

### Collection: notifications
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  type: "info" | "success" | "warning" | "error" | ...,
  title: String,
  message: String,
  icon: String,
  color: String,
  isRead: Boolean,
  relatedId: ObjectId,
  relatedModel: String,
  actionUrl: String,
  createdAt: Date,
  expiresAt: Date (auto-delete after 30 days)
}
```

---

## 🔐 Création d'un Utilisateur Admin

### Méthode 1: Via MongoDB Compass ou Shell

```javascript
// Connectez-vous à votre base MongoDB
use smartdev

// Trouvez l'utilisateur et changez son rôle
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Méthode 2: Via l'API (après création d'un utilisateur)

1. Créer un utilisateur normal via `/api/auth/register`
2. Récupérer son ID dans la réponse
3. Utiliser MongoDB pour changer le rôle à `admin`

---

## 📖 Utilisation des Routes

### Exemple: Obtenir tous les utilisateurs (Admin)

```bash
curl -X GET "http://localhost:3003/api/user/admin/all?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Exemple: Créer une notification (Admin)

```bash
curl -X POST "http://localhost:3003/api/notifications/admin/create" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_MONGODB_ID",
    "type": "info",
    "title": "Bienvenue!",
    "message": "Merci de vous être inscrit sur SmartDev"
  }'
```

### Exemple: Diffuser une notification à tous (Admin)

```bash
curl -X POST "http://localhost:3003/api/notifications/admin/broadcast" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "warning",
    "title": "Maintenance Programmée",
    "message": "Le système sera en maintenance le 20/01/2026"
  }'
```

---

## ✨ Fonctionnalités Avancées

### Pagination
Toutes les routes admin supportent la pagination :
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 20, max: 100)

### Filtrage
- **Users**: Filtrer par `role`, `isActive`, recherche par `search`
- **Bookings**: Filtrer par `status`, `serviceName`, `userId`
- **Consultations**: Filtrer par `status`, `projectType`, recherche
- **Notifications**: Filtrer par `userId`, `type`, `isRead`

### Population
Les routes admin utilisent `.populate()` pour inclure les données utilisateur liées :
- Bookings incluent les infos de l'utilisateur
- Consultations incluent les infos de l'utilisateur
- Notifications incluent les infos de l'utilisateur

---

## 🐛 Dépannage

### Erreur: "MONGODB_URI is not defined"
- Vérifiez que `.env.local` existe à la racine du projet
- Vérifiez que `MONGODB_URI` est défini dans ce fichier

### Erreur: "Invalid or expired token"
- Le token JWT a expiré (durée de vie: 7 jours par défaut)
- Reconnectez-vous pour obtenir un nouveau token

### Erreur: "Admin access required" (403)
- L'utilisateur n'a pas le rôle `admin` dans MongoDB
- Utilisez MongoDB pour définir `role: "admin"`

### Erreur de connexion MongoDB
- Vérifiez que votre IP est whitelistée dans MongoDB Atlas
- Vérifiez les credentials dans l'URI de connexion

---

## 📝 Notes Importantes

1. **Sécurité**: 
   - Les mots de passe sont hashés avec bcrypt
   - Les tokens JWT expirent après 7 jours
   - Les routes admin nécessitent authentification + rôle admin

2. **Performance**:
   - Indexes créés sur les champs fréquemment interrogés
   - Les notifications expirent automatiquement après 30 jours
   - Pagination pour toutes les listes

3. **Données**:
   - Toutes les données sont maintenant dans MongoDB
   - Pas de mock data
   - Connexion persistante à la base de données

---

## 🎉 Conclusion

Votre application SmartDev Client Portal est maintenant **complètement intégrée avec MongoDB** ! Toutes les opérations de création, lecture, modification et suppression utilisent la base de données MongoDB Atlas.

### Routes Disponibles:
- ✅ **26 routes** au total
- ✅ **10 routes publiques/utilisateur**
- ✅ **16 routes admin**
- ✅ Toutes connectées à MongoDB

Pour plus de détails, consultez `API_DOCUMENTATION.md` ! 🚀
