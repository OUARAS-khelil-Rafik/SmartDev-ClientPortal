# 🚀 Guide de Démarrage Rapide

## Problème Résolu ✅

Les scripts de test ont été **corrigés** pour :
- ✅ Utiliser le bon port (3002 au lieu de 3003)
- ✅ Être compatible avec macOS
- ✅ Fonctionner correctement avec les commandes shell

## 🎯 Démarrer le Serveur

### 1. Vérifier que MongoDB est configuré

```bash
# Vérifiez que .env.local existe à la racine du projet
cat .env.local | grep MONGODB_URI
```

### 2. Démarrer le serveur

```bash
cd server
npm start
```

Vous devriez voir :
```
✅ Server running on http://localhost:3002
📝 API Documentation: http://localhost:3002/api/docs
✅ MongoDB Atlas connected successfully
📍 Database: novalis-ai
```

## 🧪 Tester l'API

### Option 1 : Health Check Rapide
```bash
./health-check.sh
```

### Option 2 : Tests Complets (Simple)
```bash
cd server
./test-api-simple.sh
```

### Option 3 : Tests Complets (Avancés)
```bash
cd server
./test-mongodb-api.sh
```

## 📊 Ce qui a été corrigé

### Avant ❌
- Port incorrect (3003 au lieu de 3002)
- Commandes incompatibles avec macOS (`head -n-1`)
- Erreurs "illegal line count"

### Maintenant ✅
- Port correct (3002)
- Compatible macOS
- Fonctions shell robustes
- Nouveau script simple : `test-api-simple.sh`

## 🔍 Vérification Rapide

```bash
# 1. Le serveur tourne-t-il ?
lsof -ti:3002

# 2. Health check
curl http://localhost:3002/api/health

# 3. Root endpoint
curl http://localhost:3002/
```

## 📝 Routes Disponibles

Avec le serveur en cours d'exécution sur **http://localhost:3002** :

### Routes Publiques
- `GET  /api/health` - Santé du serveur
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/consultation` - Consultation AI

### Routes Utilisateur (nécessite authentification)
- `GET  /api/user/profile` - Profil utilisateur
- `PUT  /api/user/profile` - Modifier profil
- `GET  /api/booking` - Mes réservations
- `POST /api/booking` - Créer réservation
- `GET  /api/notifications` - Mes notifications

### Routes Admin (nécessite rôle admin)
- `GET  /api/user/admin/all` - Tous les utilisateurs
- `GET  /api/booking/admin/all` - Toutes les réservations
- `GET  /api/consultation/admin/all` - Toutes les consultations
- `POST /api/notifications/admin/create` - Créer notification
- `POST /api/notifications/admin/broadcast` - Diffuser notification

## 🎨 Exemple d'Utilisation

### 1. Inscription
```bash
curl -X POST http://localhost:3002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 2. Connexion
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Obtenir le profil
```bash
curl -X GET http://localhost:3002/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔑 Créer un Administrateur

1. Créer un utilisateur via l'API
2. Dans MongoDB Compass ou shell :
```javascript
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## 📚 Documentation Complète

- 📄 **[server/API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)** - Documentation API
- 📄 **[MONGODB_MIGRATION_GUIDE.md](MONGODB_MIGRATION_GUIDE.md)** - Guide MongoDB
- 📄 **[SUMMARY.md](SUMMARY.md)** - Résumé des changements

## ❓ Dépannage

### Le serveur ne démarre pas
```bash
# Vérifier que MongoDB URI est configuré
cat .env.local | grep MONGODB_URI

# Vérifier que le port n'est pas utilisé
lsof -ti:3002

# Réinstaller les dépendances
cd server
rm -rf node_modules
npm install
```

### Les tests échouent
```bash
# 1. Vérifier que le serveur tourne
./health-check.sh

# 2. Redémarrer le serveur
cd server
npm start

# 3. Réessayer les tests
./test-api-simple.sh
```

### Erreur MongoDB
```bash
# Vérifier la connexion MongoDB
curl http://localhost:3002/api/health

# Vérifier que l'IP est whitelistée dans MongoDB Atlas
# Aller sur MongoDB Atlas > Network Access > Add IP Address
```

## ✅ Checklist

- [ ] Fichier `.env.local` créé et configuré
- [ ] MongoDB URI valide
- [ ] Serveur démarre sans erreur (`npm start`)
- [ ] Health check passe (`./health-check.sh`)
- [ ] Tests API passent (`./test-api-simple.sh`)
- [ ] Au moins un admin créé dans MongoDB

## 🎉 Tout est Prêt !

Votre application SmartDev Client Portal est maintenant **100% opérationnelle** avec MongoDB ! 🚀

**Port du serveur** : `3002`  
**Base de données** : MongoDB Atlas  
**Collections** : users, bookings, consultations, notifications  

---

**Dernière mise à jour** : 18 janvier 2026  
**Status** : ✅ Opérationnel
