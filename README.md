# 🧘‍♀️ Yoga App - Testing Project

![Java](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green) ![Angular](https://img.shields.io/badge/Angular-19+-red) ![Coverage](https://img.shields.io/badge/Coverage->80%25-brightgreen)

Ce dépôt contient le code source d'une application de gestion de sessions de Yoga.
Ce projet (P4 OpenClassrooms) visait à implémenter une suite complète de tests (Unitaires, Intégration, E2E) et à corriger la dette technique.

---

## 🛠️ Prérequis

Assurez-vous d'avoir installé les outils suivants :

- **Java** (JDK 21)
- **Maven** (v3.9.3+)
- **Node.js** (LTS) & **NPM**
- **Docker Desktop** (Obligatoire pour la base de données)
- **Angular CLI** (v19+)

---

## 🚀 Installation et Lancement

### 1. Clonage du projet

```bash
git clone https://github.com/apalermo/yoga-app.git
cd yoga-app
```

### 2. Lancement du Back-end (Spring Boot)

Le projet utilise **Docker Compose** pour monter automatiquement une base de données MySQL.
Assurez-vous que Docker Desktop est lancé avant d'exécuter la commande.

```bash
cd back
mvn clean install
mvn spring-boot:run
```

- Le serveur API démarre sur : `http://localhost:8080`
- Un conteneur Docker MySQL (`back-mysql`) est automatiquement initialisé.

### 3. Lancement du Front-end (Angular)

```bash
cd front
npm install
npm start
```

- L'application est accessible sur : `http://localhost:4200`

---

## 🔑 Connexion (Compte Admin)

Pour accéder aux fonctionnalités administrateur (création de sessions, suppression), utilisez les identifiants par défaut :

| Rôle      | Email             | Mot de passe |
| --------- | ----------------- | ------------ |
| **Admin** | `yoga@studio.com` | `test!1234`  |

> ⚠️ **Note :** Si la base de données est vide au premier lancement, vous devrez peut-être exécuter le script SQL d'insertion manuellement ou via l'interface Docker (voir `ressources/sql/insert_user.sql`).

---

## 🧪 Tests & Qualité (Feature Focus)

L'objectif principal était de sécuriser l'application avec une couverture de tests > 80%.

### 🟦 Back-end : Tests Unitaires & Intégration

Technologies : **JUnit 5**, **Mockito**, **JaCoCo**.

**Lancer les tests :**

```bash
cd back
mvn clean verify
```

_Le rapport HTML est disponible ici : `back/target/site/jacoco/index.html`_

![Backend Coverage](/documentation/images/back-coverage.jpeg)

### 🟥 Front-end : Tests Unitaires (Jest)

Technologies : **Jest**, **Istanbul**.

**Lancer les tests avec couverture :**

```bash
cd front
npm run test -- --code-coverage
```

_Le rapport est généré dans : `front/coverage/jest/lcov-report`_

![Frontend Coverage](/documentation/images/front-coverage.jpeg)

### 🟩 Front-end : Tests E2E (Cypress)

Les parcours critiques sont validés via **Cypress** avec mocking des API pour une isolation totale.

**Lancer les tests E2E :**

```bash
cd front
npm run e2e
```

**Résultat de la couverture (Code Coverage) :**

![E2E Coverage](/documentation/images/e2e-coverage.jpeg)

> **Score Global : 96%** de couverture des instructions.

<details>
<summary><strong>🔍 Détail des scénarios testés (Conformité Testing Plan)</strong></summary>

| Fichier Test            | Scénarios Couverts                                                         |
| ----------------------- | -------------------------------------------------------------------------- |
| `login.cy.ts`           | **Connexion :** Succès, Erreur login/mdp, Champs obligatoires              |
| `register.cy.ts`        | **Inscription :** Création compte, Champs obligatoires                     |
| `sessions-list.cy.ts`   | **Sessions :** Affichage liste, Boutons "Create/Detail" (Admin uniquement) |
| `sessions-form.cy.ts`   | **Formulaire :** Création/Modification, Champs obligatoires                |
| `sessions-detail.cy.ts` | **Détail :** Affichage infos, Suppression (Admin uniquement)               |
| `me.cy.ts`              | **Account :** Affichage infos utilisateur                                  |
| `logout.cy.ts`          | **Déconnexion :** Déconnexion utilisateur                                  |

</details>

---

## 📚 Ressources Annexes

- **Postman :** Une collection est disponible pour tester l'API manuellement dans `postman/yoga.postman_collection.json`.
- **Configuration Qualité :**
  - `lombok.config` : Exclusion du code généré (Getters/Setters) de la couverture.
  - `pom.xml` : Exclusion des DTO/Mappers pour affiner les métriques JaCoCo.

---

## 👤 Auteur

**Anthony Palermo**
