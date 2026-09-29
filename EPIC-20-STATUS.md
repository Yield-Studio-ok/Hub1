# Epic 20: Entorno y Equipo — Estado de la Rama

> ⚠️ **Esta rama está a la mitad.** No está lista para merge a `develop`. A continuación se documenta qué se hizo, qué falta y el contexto necesario para continuar.

**Rama:** `epic/20-entorno-equipo`  
**Base:** `develop` (commit `3d91c2f`)  
**Fecha de último avance:** 2026-09-16

---

## ✅ Lo que ya se hizo

### Commits en la rama

1. **`chore: ignore local patch scripts`** — Se agregaron los archivos `patch_*.js` al `.gitignore` para evitar subir scripts temporales de refactor al repositorio.
2. **`fix(infra): resolve TS errors for toSorted and Prisma timeLog`** — Se corrigieron errores de TypeScript en `infra.service.ts` (reemplazo de `.toSorted()` por `[...arr].sort()`) y se regeneró el cliente de Prisma para que reconozca el modelo `TimeLog`.

### Estado del codebase al momento del push

- **Typecheck API:** ✅ Pasa sin errores (`tsc --noEmit`).
- **Lefthook hooks (pre-commit / pre-push):** ✅ Pasan (oxfmt, oxlint, typecheck).
- **Archivos `patch_*.js`:** Son scripts de refactor one-shot que se usaron para migrar la página de Settings de `defaultValue` a controlled inputs y de un theme local a `useTheme`. Ya fueron aplicados. Están correctamente ignorados en `.gitignore`.

---

## 🚧 Lo que falta por hacer

> Esta épica debería cubrir la configuración del entorno de equipo. Los tickets específicos deben definirse, pero según el contexto del proyecto, los temas pendientes incluyen:

1. **Sección Settings (apps/web/app/settings/page.tsx):**
   - Los patches ya aplicaron los inputs controlados y el `useTheme`, pero falta:
     - Conectar el guardado de perfil a un endpoint real del backend (actualmente es un `setTimeout` mock de 800ms).
     - Conectar la subida de avatar a un servicio de storage real.
     - Implementar el cambio de contraseña real (actualmente es UI-only).
     - Implementar 2FA real.
     - Persistir las preferencias de notificaciones.

2. **Sección Team (apps/web/app/team/page.tsx):**
   - La UI ya existe (tabla, cuadrícula, modal de invitación), pero:
     - Falta conectar la invitación de miembros al backend (actualmente agrega al estado local).
     - Falta un endpoint CRUD de miembros del equipo (`/api/team`).
     - Falta integración con roles reales del backend (Epic 13 implementó `@Roles()` y `RolesGuard`).
     - Falta persistencia de miembros en la base de datos (modelo `TeamMember` en Prisma).

3. **Backend pendiente:**
   - Endpoint `PATCH /api/users/me` para actualizar perfil.
   - Endpoint CRUD `/api/team` (invitar, listar, editar rol, eliminar miembro).
   - Modelo de Prisma `TeamMember` (o relación User ↔ Project con rol).

4. **Tests pendientes:**
   - Tests de integración backend para los nuevos endpoints.
   - Actualizar tests frontend que usen mocks para que reflejen la integración real.

---

## 🧠 Contexto del Proyecto (de Obsidian Memory)

### Arquitectura General

- **Monorepo** con `pnpm workspaces`:
  - `apps/web` → Next.js (frontend)
  - `apps/api` → NestJS (backend)
- **ORM:** Prisma con PostgreSQL en Neon Cloud.
- **Auth:** Firebase Authentication.
- **Estilo UI:** Glassmorphism dark (`bg-slate-950` + halos índigo/violeta + `backdrop-blur`).
- **Linting/Formatting:** oxlint + oxfmt via Lefthook (pre-commit y pre-push hooks).
- **Metodología:** TDD estricto — los tests se escriben ANTES de implementar.

### Épicas anteriores relevantes

| Épica                    | Rama                            | Relevancia                                                                                       |
| ------------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------ |
| 11 - DB y Persistencia   | `epic/11-database-persistencia` | Setup de Prisma, modelos `User`, `Project`.                                                      |
| 13 - Roles y Permisos    | `epic/13-roles-permisos`        | `@Roles()` decorator, `RolesGuard`, hook `useRole()` en frontend. Roles: FOUNDER, PM, DEVELOPER. |
| 17 - Telemetría y Neon   | `epic/17-telemetria-neon`       | Widget VPS (`systeminformation`), integración Neon DB consumption.                               |
| 18 - Timer y Plane       | `epic/18-timer-plane`           | Modelo `TimeLog` en Prisma, integración con API de Plane.                                        |
| 19 - Proyectos y Deploys | `epic/19-proyectos-deploys`     | Campos `repoUrl`/`deployUrl` en Project, integración Vercel/GitHub, LogViewer.                   |

### Problemas conocidos

1. **Carpeta `apps/api/dist` con permisos root:** Fue generada por un proceso con usuario `nobody`. Se renombró a `dist.old` para desbloquear el typecheck. **Acción recomendada:** eliminarla con `sudo rm -rf apps/api/dist.old`.
2. **Prisma Client y tests:** En tests no se debe importar directamente enums de `@prisma/client` — usar strings literales para evitar desincronización del autogenerador.
3. **Plane API 403:** La API de Plane a veces devuelve 403 al intentar marcar tickets como completados. Verificar permisos del API key.

### Variables de entorno requeridas (ver `.env.example`)

- `DATABASE_URL` — Connection string de Neon PostgreSQL.
- Credenciales de Firebase (no se suben al repo, están en `.env.local`).
- API keys de Plane, Vercel, Cloudflare, Neon (según los módulos que se usen).

---

## 📋 Checklist para continuar

- [ ] Definir tickets específicos de esta épica en Plane.
- [ ] Crear modelo `TeamMember` en Prisma schema.
- [ ] Implementar endpoints backend (perfil, equipo).
- [ ] Conectar frontend Settings y Team con endpoints reales.
- [ ] Escribir tests TDD para cada endpoint y componente.
- [ ] Limpiar `apps/api/dist.old` (requiere `sudo`).
- [ ] Verificar que todo pase typecheck + tests antes de merge a `develop`.
