# LeadsApp — Full Stack (Angular 16 + .NET 8)

Sistema de gestão de Leads com CRUD completo e gerenciamento de Tasks por Lead.

---

## 🚀 Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular 16, Angular Material, Bootstrap 5 |
| Backend | .NET 8, ASP.NET Core Web API, EF Core |
| Banco | PostgreSQL (Docker) |
| Auth | JWT Bearer |
| Testes BE | xUnit, Moq, FluentAssertions |
| Testes FE | Jasmine, Karma |

---

## 📦 Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org)
- [Docker](https://www.docker.com)
- [Angular CLI 16](https://angular.io/cli): `npm i -g @angular/cli@16`

---

## ▶️ Como rodar

### 1. Banco de dados
```bash
docker compose up -d
```

### 2. Backend
```bash
cd backend
dotnet restore
dotnet run --project src/Api
# API: http://localhost:5000
# Swagger: http://localhost:5000/swagger
```
> As migrations são aplicadas automaticamente na inicialização.

### 3. Frontend
```bash
cd frontend
npm install
ng serve
# App: http://localhost:4200
```

### 4. Credenciais padrão

Usuário: admin
Senha:   admin123

backend/src/
├── Api/           # Controllers, Middleware, Program.cs
├── Application/   # Services, DTOs, Validators (FluentValidation)
├── Domain/        # Entities, Interfaces, Enums
└── Infra/         # DbContext (EF Core), Repositories, DI

**Decisões:**
- **Clean Architecture** com separação em camadas — Domain não depende de nada externo
- **Repository Pattern** — abstração do acesso a dados via `ILeadRepository` / `ITaskRepository`
- **Soft Delete** — registros não são removidos fisicamente; usam `IsDeleted` + `HasQueryFilter` global
- **JWT Auth** — token stateless com expiração configurável via `appsettings.json`
- **FluentValidation** — validações desacopladas dos controllers
- **JsonStringEnumConverter** global — enums trafegam como string (`"New"`, `"Todo"`) em vez de int
- **Auto-migrate** — `MigrateAsync()` no startup garante banco sempre atualizado

### Frontend — Standalone Components

frontend/src/app/
├── core/
│   ├── guards/        # AuthGuard (CanActivate funcional)
│   ├── interceptors/  # AuthInterceptor (JWT), ErrorInterceptor
│   ├── models/        # Interfaces TypeScript
│   └── services/      # AuthService, LeadService, TaskService
├── pages/
│   ├── login/
│   ├── leads/         # Lista + LeadFormDialog
│   └── lead-detail/   # Kanban de Tasks + TaskFormDialog
└── shared/
└── components/    # NavbarComponent, ConfirmDialogComponent

**Decisões:**
- **Standalone Components** — sem NgModules, tree-shaking mais eficiente
- **Lazy Loading** — cada rota carrega o componente sob demanda (`loadComponent`)
- **Functional Guards e Interceptors** — padrão moderno do Angular 16+
- **HttpInterceptor funcional** — injeta Bearer token automaticamente em todas as requests
- **Error Interceptor** — trata 401 (redirect login) e erros globais com `MatSnackBar`
- **Reactive Forms** com validação em tempo real
- **Kanban view** para Tasks — UX intuitiva com movimentação de status via menu contextual
- **Bootstrap 5** para grid responsivo + **Angular Material** para componentes UI

---

## 🧪 Testes

### Backend
```bash
cd backend
dotnet test
```
Cobre: `LeadService`, `TaskService` (unitários com Moq)

### Frontend
```bash
cd frontend
ng test --watch=false --browsers=ChromeHeadless
```
Cobre: `AuthService`, `LeadService`, `TaskService`, `AuthGuard`

---

## 🌟 Funcionalidades

- ✅ CRUD completo de Leads com filtro por status e busca
- ✅ CRUD de Tasks por Lead com visualização Kanban
- ✅ Movimentação rápida de status de Task via menu contextual
- ✅ Indicador de tasks atrasadas
- ✅ Autenticação JWT com guarda de rotas
- ✅ Soft Delete em Leads e Tasks
- ✅ Paginação server-side
- ✅ Layout responsivo (mobile-first)
- ✅ Feedback visual com snackbars e dialogs de confirmação

---

## ⚙️ Configuração

**Backend** — `backend/src/Api/appsettings.json`:
```json
{
  "ConnectionStrings": { "Default": "Host=localhost;Port=5432;Database=leadsdb;Username=postgres;Password=postgres" },
  "Jwt": { "Secret": "super-secret-key-min-32-chars-here!!", "Issuer": "LeadsApp", "Audience": "LeadsApp", "ExpiresInDays": 7 },
  "Auth": { "Username": "admin", "Password": "admin123" }
}
```

**Frontend** — `frontend/src/environments/environment.ts`:
```typescript
export const environment = { production: false, apiUrl: 'http://localhost:5000/api' };
```