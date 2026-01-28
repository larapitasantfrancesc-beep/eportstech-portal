# Guía de Contribución

## Procesos para Contribuir

### 1. Setup de Desarrollo

```bash
git clone https://github.com/tu-usuario/eportstech-portal.git
cd eportstech-portal
npm install
cp .env.example .env.local
# Editar .env.local con tus credenciales
npm run dev
```

### 2. Estructura de Ramas

- `main` - Producción (protegida)
- `develop` - Desarrollo
- `feature/*` - Nuevas funcionalidades
- `bugfix/*` - Correcciones
- `hotfix/*` - Parches urgentes

### 3. Commit Messages

Seguir formato conventional commits:

```
feat: agregar nueva funcionalidad
fix: corregir bug
docs: actualizar documentación
style: cambios de formato
refactor: restructuración sin cambiar lógica
perf: mejora de performance
test: agregar tests
chore: cambios de configuración
```

Ejemplo:
```
feat: agregar nuevo widget de testimonios
fix: resolver problema de scroll en móvil
docs: actualizar instrucciones de instalación
```

### 4. Pull Request

1. Crear rama desde `develop`
2. Hacer cambios y commits
3. Push a origin
4. Crear PR hacia `develop`
5. Completar template PR
6. Esperar revisión

**Template PR:**
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Nuevo feature
- [ ] Bugfix
- [ ] Breaking change
- [ ] Documentación

## Changes
- Change 1
- Change 2

## Testing
Cómo se probó:
- [ ] Tested locally
- [ ] Tested on multiple browsers

## Screenshots (si aplica)
```

### 5. Estándares de Código

#### TypeScript
- Tipos explícitos para props
- Evitar `any` excepto casos justificados
- Interfaces para tipos complejos

```typescript
interface Props {
  lang: Language;
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
}

const Component: React.FC<Props> = ({ lang, onSubmit, isLoading = false }) => {
  // ...
};
```

#### React
- Componentes funcionales con hooks
- Props bien documentadas
- Memoization para componentes costosos

```typescript
const ExpensiveComponent = React.memo(({ data }: Props) => {
  // ...
}, (prevProps, nextProps) => {
  return prevProps.data === nextProps.data;
});
```

#### CSS
- Usar Tailwind para estilos
- Nombres de clases descriptivos
- Responsive mobile-first

```jsx
<div className="flex flex-col md:flex-row gap-4 px-4 md:px-8">
  {/* Content */}
</div>
```

### 6. Testing

```bash
# Ejecutar tests
npm run test

# Cobertura
npm run test:coverage

# Watch mode
npm run test:watch
```

### 7. Linting y Formatting

```bash
# ESLint
npm run lint

# Prettier (formatting)
npm run format

# Fix issues
npm run lint:fix
npm run format:fix
```

### 8. Documentación

- Documentar funciones públicas
- Actualizar README si hay cambios mayores
- Comentarios para lógica compleja

```typescript
/**
 * Fetch brand configuration from Supabase
 * @param {string} brandId - Brand identifier
 * @returns {Promise<BrandConfig>} Brand configuration object
 * @throws {Error} If fetch fails
 */
export const getBrandConfig = async (brandId: string): Promise<BrandConfig> => {
  // ...
};
```

### 9. Performance

- Evitar re-renders innecesarios
- Lazy load componentes
- Optimizar imágenes
- Code splitting

```typescript
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

### 10. Security

- No commitear `.env` con credenciales
- Validar inputs del usuario
- CORS configurado correctamente
- Sanitizar HTML si necesario

## Checklist antes de hacer commit

- [ ] Código funciona localmente
- [ ] No hay errores de linting
- [ ] Tests pasan (si existen)
- [ ] Commits con mensajes claros
- [ ] No incluir archivos innecesarios
- [ ] README actualizado (si necesario)
- [ ] No hay credenciales expuestas

## Reportar Bugs

Incluir:
1. Descripción clara del problema
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Screenshots si aplica
5. Navegador y versión
6. Node.js version (`node -v`)

## Preguntas?

- Abrir issue en GitHub
- Discutir en Pull Requests
- Contactar al team lead

---

¡Gracias por contribuir a EportsTech Portal! 🚀
