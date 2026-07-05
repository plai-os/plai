const SOURCE_LABELS = {
  casino: "Casino",
  live: "Live Casino",
  bingo: "Bingo"
};

const ROUTES = new Set([
  "home",
  "my-casino",
  "games",
  "live",
  "bingo",
  "lotteries",
  "promos",
  "help",
  "ai-backlog",
  "ai-markets",
  "ai-knowledge",
  "ai-studio",
  "ai-brands",
  "ai-widgets",
  "ai-suggestions",
  "ai-experiment",
  "ai-automation",
  "analytics",
  "documentation",
  "account"
]);

const AI_STUDIO_KEY = "impossibleAiStudioRequests";
const AI_STUDIO_STYLE_KEY = "impossibleAiStudioStyle";
const AI_STUDIO_ROLLBACK_KEY = "impossibleAiStudioRollback";
const AI_STUDIO_DOCK_KEY = "impossibleAiStudioDock";
const AI_WIDGETS_KEY = "impossibleAiWidgets";
const AI_BRAND_KEY = "impossibleSelectedBrand";
const AI_SEGMENTS_KEY = "impossibleAiSegments";
const AI_DASHBOARDS_KEY = "impossibleAiDashboards";
const AI_DASHBOARD_TITLES_KEY = "impossibleAiDashboardTitles";
const AI_DASHBOARD_METRIC_ORDER_KEY = "impossibleAiDashboardMetricOrder";
const PLAYAI_TITLE_OVERRIDES_KEY = "impossiblePlayAiTitleOverrides";
const PLAYAI_KNOWLEDGE_STATUS_KEY = "impossiblePlayAiKnowledgeStatus";
const PLAYAI_KNOWLEDGE_LOCKS_KEY = "impossiblePlayAiKnowledgeLocks";
const PLAYAI_KNOWLEDGE_REQUIREMENTS_KEY = "impossiblePlayAiKnowledgeRequirements";
const PLAYAI_BACKLOG_SELECTION_KEY = "impossiblePlayAiBacklogSelection";
const PLAYAI_BACKLOG_CUSTOM_KEY = "impossiblePlayAiCustomBacklogItems";
const PLAYAI_BACKLOG_OVERRIDES_KEY = "impossiblePlayAiBacklogOverrides";
const PLAYAI_BACKLOG_DELETED_KEY = "impossiblePlayAiBacklogDeleted";
const PLAYAI_BACKLOG_STORAGE_VERSION_KEY = "impossiblePlayAiBacklogStorageVersion";
const PLAYAI_BACKLOG_STORAGE_VERSION = "2026-07-04-audit-status-reconcile";
const PLAYAI_BACKLOG_SOURCE_URL = "data/workspace-backlog.json";
const PLAYAI_API_BASE = (globalThis.PLAI_API_BASE || "").replace(/\/$/, "");
const PLAYAI_BACKLOG_API_URL = `${PLAYAI_API_BASE}/api/backlog`;
const LOTTERY_HELPER_DISMISSED_KEY = "impossibleLotteryHelperDismissed";
const SITE_LANGUAGE_KEY = "impossibleSiteLanguage";
const OFFER_EXPERIMENT_INDEX_KEY = "impossibleOfferExperimentIndex";
const CATALOGUE_CACHE_VERSION = 12;
const CATALOGUE_SOURCE_URL = "data/lottoland-game-catalogue.json";
const CATALOGUE_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;
const CATALOGUE_MIN_EXPECTED_GAMES = 500;
const PLAYAI_ROUTES = new Set([
  "ai-backlog",
  "ai-markets",
  "ai-knowledge",
  "ai-studio",
  "ai-brands",
  "ai-widgets",
  "ai-suggestions",
  "ai-experiment",
  "ai-automation",
  "analytics",
  "documentation"
]);

function storageGet(keys) {
  const extensionStorage = globalThis.chrome?.storage?.local;
  if (!extensionStorage?.get) return Promise.resolve({});

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value = {}) => {
      if (settled) return;
      settled = true;
      resolve(value || {});
    };

    try {
      const maybePromise = extensionStorage.get(keys, finish);
      if (maybePromise?.then) {
        maybePromise.then(finish).catch(() => finish({}));
      }
    } catch (error) {
      try {
        const maybePromise = extensionStorage.get(keys);
        if (maybePromise?.then) {
          maybePromise.then(finish).catch(() => finish({}));
        } else {
          finish(maybePromise || {});
        }
      } catch {
        finish({});
      }
    }
  });
}

function storageSet(values) {
  const extensionStorage = globalThis.chrome?.storage?.local;
  if (!extensionStorage?.set) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    try {
      const maybePromise = extensionStorage.set(values, finish);
      if (maybePromise?.then) {
        maybePromise.then(finish).catch(finish);
      }
    } catch {
      try {
        const maybePromise = extensionStorage.set(values);
        if (maybePromise?.then) {
          maybePromise.then(finish).catch(finish);
        } else {
          finish();
        }
      } catch {
        finish();
      }
    }
  });
}

const SITE_TRANSLATIONS = {
  en: {},
  es: {
    navHome: "Inicio",
    navGames: "Juegos",
    navLive: "Casino en vivo",
    navBingo: "Bingo",
    navLotteries: "Loterías",
    navPromotions: "Promociones",
    navHelp: "Centro de ayuda",
    joinNow: "Únete ahora",
    logIn: "Iniciar sesión",
    heroEyebrow: "Juegos, casino y botes",
    heroTitle: "Impossible Casino",
    heroCopy: "Un casino conceptual lleno de brillo, creado con componentes reales de juegos y diseñado para sentirse totalmente nuestro.",
    startPlaying: "Empezar a jugar",
    howItWorks: "Cómo funciona",
    builderIntro: "Crea carruseles, busca y filtra el catálogo de juegos, y añade juegos a tu casino personal.",
    gameLibrary: "Biblioteca de juegos",
    search: "Buscar",
    searchPlaceholder: "Nombre del juego o proveedor",
    gamesFrom: "Juegos de",
    allGames: "Todos los juegos",
    sourceCasino: "Casino",
    sourceLive: "Casino en vivo",
    sourceBingo: "Bingo",
    provider: "Proveedor",
    allProviders: "Todos los proveedores",
    featuredGames: "Juegos destacados",
    promotions: "Oferta de bienvenida",
    rewardsTitle: "Consigue 50 tiradas gratis",
    rewardsCopy: "Únete hoy a Impossible Casino y prueba slots seleccionadas con un impulso de bienvenida. 18+. Se aplican términos.",
    exploreRewards: "Reclamar oferta",
    lotteries: "Loterías",
    lotteryPromoTitle: "Sorteo de hoy: £69m",
    lotteryPromoCopy: "Elige tus números antes de que cierre el sorteo y crea cada línea en un flujo de boleto sencillo.",
    seeLotteries: "Elegir números",
    lotteryName: "Impossible Millions",
    lotteryTitle: "Crea tu boleto de la suerte",
    lotteryCopy: "Elige 5 números y 2 estrellas por línea, usa selección rápida, escoge los días del sorteo y pasa por caja con fluidez.",
    estimatedJackpot: "bote estimado",
    drawsMeta: "Sorteos cada martes y viernes",
    priceMeta: "£2.50 por línea",
    numbersMeta: "Elige 5 números y 2 estrellas",
    quickPicks: "Selecciones rápidas",
    clearAll: "Borrar todo",
    participateTitle: "¿Cuándo te gustaría participar?",
    tue: "Mar",
    fri: "Vie",
    all: "Todo",
    durationTitle: "Elige la duración",
    autoRenew: "Renovación automática",
    autoRenewCopy: "Los mismos números en cada sorteo elegido. Cancela cuando quieras.",
    harvestTitle: "Ganadores recientes",
    harvestCopy: "Una persona en Leeds convirtió un giro de suerte en £18,420 esta semana.",
    composeTitle: "Impulso de fin de semana",
    composeCopy: "Juegos seleccionados tienen tiradas gratis extra cada viernes, sábado y domingo.",
    sparkleTitle: "Alerta de bote",
    sparkleCopy: "Impossible Millions muestra ahora un premio principal estimado de £69m.",
    accountArea: "Área de cuenta",
    accountTitle: "Únete a la lista Impossible",
    accountCopy: "Compara dos conceptos de registro con la misma información: un formulario completo y un flujo por pasos.",
    launchRegistration: "Abrir registro",
    abCopy: "La prueba A/B vive dentro del popup y recuerda la versión seleccionada para el siguiente lanzamiento.",
    helpCentre: "Centro de ayuda",
    helpTitle: "¿Cómo podemos ayudarte?",
    helpCopy: "Respuestas cercanas para el concepto Impossible Casino: encontrar juegos, crear tu lobby, loterías, cuentas y juego más seguro.",
    account: "Cuenta",
    saferPlay: "Juego más seguro",
    helpGamesTitle: "Juegos y lobbies",
    helpFindGameQ: "¿Cómo encuentro un juego?",
    helpFindGameA: "Usa la navegación principal para explorar Juegos, Casino en vivo o Bingo. Cada lobby está agrupado en carriles temáticos, y Ver todo abre una cuadrícula más amplia.",
    helpPlayQ: "¿Qué pasa cuando pulso Jugar?",
    helpPlayA: "Jugar abre el inicio de sesión de Impossible. Así la demo se mantiene dentro de la experiencia de marca y muestra dónde iniciaría sesión una persona real.",
    helpRepeatGameQ: "¿Por qué algunos juegos aparecen en varios sitios?",
    helpRepeatGameA: "Los juegos pueden aparecer en destacados, grupos de proveedor o carruseles personales. Así mostramos cómo el mismo catálogo puede reorganizarse para distintos recorridos.",
    helpMyCasinoQ: "¿Qué es My Casino?",
    helpMyCasinoA: "My Casino es un creador de lobby personal. Puedes crear carruseles, añadir juegos, reordenarlos y guardar el resultado como un lobby normal.",
    helpAddGamesQ: "¿Cómo añado juegos a un carrusel?",
    helpAddGamesA: "Abre Editar lobby, busca o filtra la biblioteca y arrastra el juego al carrusel que prefieras. También puedes reordenar juegos dentro del carrusel.",
    helpRenameQ: "¿Puedo cambiar el nombre de My Casino?",
    helpRenameA: "Sí. En modo edición puedes cambiar el nombre del lobby. La navegación principal también se actualiza para reflejarlo en todo el sitio.",
    helpTicketQ: "¿Cómo completo un boleto de lotería?",
    helpTicketA: "Elige 5 números y 2 estrellas en una tarjeta. La línea necesita ambas partes antes de poder continuar al checkout.",
    helpDiceQ: "¿Qué hacen los dados y las selecciones rápidas?",
    helpDiceA: "El dado aleatoriza una línea. Las selecciones rápidas pueden completar una, tres o todas las tarjetas para llegar más rápido al checkout.",
    helpDaysQ: "¿Puedo elegir días y semanas de sorteo?",
    helpDaysA: "Sí. Elige martes, viernes o ambos, y después el número de semanas. El resumen actualiza líneas completas, renovación y coste total.",
    helpAccountTitle: "Cuenta, inicio de sesión y registro",
    helpRealAccountQ: "¿Es un registro de cuenta real?",
    helpRealAccountA: "No. El registro y el inicio de sesión son flujos conceptuales. Sirven para mostrar el recorrido del cliente y no envían datos.",
    helpTwoRegQ: "¿Por qué hay dos diseños de registro?",
    helpTwoRegA: "El prototipo compara un formulario de una página con un flujo por pasos. AI Intelligence muestra diferencias de conversión y tiempo de finalización.",
    helpSavedQ: "¿Mi navegador mostrará emails o contraseñas guardadas?",
    helpSavedA: "Los formularios están preparados para demo y evitan, en lo posible, las sugerencias normales de credenciales guardadas.",
    helpSaferQ: "¿Qué información de juego más seguro incluye?",
    helpSaferA: "El pie incluye 18+, recordatorios para fijar límites y hacer pausas, y enlaces de apoyo a GamCare, la National Gambling Helpline y GAMSTOP.",
    helpRealSiteQ: "¿Impossible Casino es un sitio de juego real?",
    helpRealSiteA: "No. Es un prototipo conceptual de marca. El contenido de juego más seguro muestra cómo una experiencia para Reino Unido debería facilitar esta información.",
    helpSupportQ: "¿Dónde puede alguien recibir apoyo?",
    helpSupportA: "Cualquier persona afectada por el juego puede contactar con la National Gambling Helpline en el 0808 8020 133 o visitar GamCare. GAMSTOP ayuda con la autoexclusión online.",
    footerBrandCopy: "Una experiencia conceptual de marca que usa componentes reales de juegos, elevada con el sistema visual de Impossible Casino.",
    casinoGames: "Juegos de casino",
    help: "Ayuda",
    contactUs: "Contacto",
    myAccount: "Mi cuenta",
    payments: "Pagos",
    legal: "Legal",
    saferGambling: "Juego más seguro",
    depositLimits: "Límites de depósito",
    selfExclusion: "Autoexclusión",
    terms: "Términos y condiciones",
    privacy: "Política de privacidad",
    social: "Social",
    languageTitle: "Idioma",
    languageCopy: "Elige el idioma del sitio principal. Las herramientas PlayAI permanecen en inglés.",
    saferCopy: "Impossible Casino es un prototipo conceptual para mayores de 18 años. El juego debe ser entretenimiento, no una forma de ganar dinero. Fija límites, haz pausas y usa herramientas de descanso o autoexclusión si jugar deja de ser divertido.",
    supportTitle: "¿Necesitas apoyo?",
    supportCopy: "Si el juego te afecta a ti o a alguien cercano, hay apoyo gratuito y confidencial de GamCare y de la National Gambling Helpline en el 0808 8020 133. También puedes usar GAMSTOP para autoexcluirte del juego online con licencia en Reino Unido.",
    footerLegalCopy: "Impossible Casino es un prototipo conceptual. Solo 18+. Juega con responsabilidad.",
    refreshCatalogue: "Actualizar catálogo",
    readyToPlay: "Listo para jugar",
    loginPanelTitle: "Retoma el brillo donde lo dejaste.",
    createAccount: "Crea tu cuenta",
    registerPanelCopy: "Los mismos campos de registro, dos flujos de prototipo, envueltos en el mundo de marca del elefante.",
    saveLobby: "Guardar lobby",
    addCarousel: "Añadir carrusel",
    editLobby: "Editar lobby",
    viewAll: "Ver todo",
    carousel: "Carrusel",
    gamesCount: "juegos",
    emptyLobbyTitle: "Tu lobby está vacío",
    emptyLobbyCopy: "Edita tu lobby para crear carruseles y añadir juegos.",
    firstCarouselTitle: "Crea tu primer carrusel",
    firstCarouselCopy: "Añade un carrusel, busca en la biblioteca y arrastra juegos dentro.",
    use: "Usar",
    delete: "Eliminar",
    dropGames: "Suelta aquí juegos desde la biblioteca.",
    dragToReorder: "Arrastra para ordenar",
    remove: "Quitar",
    accountStep: "Cuenta",
    personalStep: "Datos personales",
    addressStep: "Dirección",
    preferencesStep: "Preferencias",
    accountHelper: "Empieza con datos seguros de acceso.",
    personalHelper: "Mantén esto alineado con la verificación de cuenta.",
    addressHelper: "Una captura de dirección compacta para el flujo conceptual.",
    preferencesHelper: "Marketing y opciones de juego responsable.",
    emailAddress: "Email",
    password: "Contraseña",
    firstName: "Nombre",
    lastName: "Apellidos",
    dateOfBirth: "Fecha de nacimiento",
    mobileNumber: "Móvil",
    postcode: "Código postal",
    addressLine1: "Dirección línea 1",
    townOrCity: "Ciudad",
    favouritePlayStyle: "Estilo de juego favorito",
    marketing: "Enviadme ofertas y novedades",
    ageConfirm: "Confirmo que tengo 18 años o más",
    termsAccept: "Acepto los términos y la política de privacidad",
    slotsAndJackpots: "Slots y botes",
    bingoRooms: "Salas de bingo",
    lotteryDraws: "Sorteos de lotería",
    createAccountShort: "Crear cuenta",
    tellUsAboutYou: "Cuéntanos sobre ti",
    compactRegistration: "Un formulario compacto con el mismo conjunto de datos de cuenta.",
    completeConcept: "Completar flujo conceptual",
    stepOf: "Paso {current} de {total}",
    back: "Atrás",
    continue: "Continuar",
    conceptComplete: "Flujo conceptual completado",
    noDataSubmitted: "No se ha enviado ningún dato. Esto solo confirma el recorrido de registro del prototipo.",
    close: "Cerrar",
    welcomeBack: "Bienvenido de nuevo a Impossible",
    loginCopy: "Inicia sesión en tu cuenta{suffix}",
    continuePlaying: " para seguir jugando.",
    newToImpossible: "¿Nuevo en Impossible?",
    join: "Únete",
    signedInTitle: "Has iniciado sesión en el prototipo",
    signedInCopy: "No se ha enviado ningún dato de cuenta. Este inicio de sesión simulado confirma el flujo conceptual.",
    backToGames: "Volver a juegos",
    stars: "Estrellas",
    ticketStatus: "{numbers}/5 números · {stars}/2 estrellas",
    yourTicket: "Tu boleto",
    checkoutReady: "Listo para checkout.",
    fillLine: "Completa al menos una línea para continuar al checkout.",
    drawDays: "Días de sorteo",
    weeks: "Semanas",
    completeLines: "Líneas completas",
    total: "Total",
    on: "Activado",
    off: "Desactivado",
    tuesday: "martes",
    friday: "viernes",
    tuesdayFriday: "martes y viernes",
    goCheckout: "Ir al checkout",
    clearLine: "Borrar línea {number}",
    randomLine: "Números aleatorios para la línea {number}",
    checkoutReadyButton: "Checkout listo",
    play: "Jugar",
    createPassword: "Crea una contraseña de demo",
    loadingGames: "Cargando juegos...",
    catalogueLoaded: "Catálogo cargado.",
    fallbackContent: "Usando contenido conceptual de respaldo.",
    fallbackHint: "Abre primero el sitio de origen si el catálogo está vacío"
  }
};

const SITE_ENGLISH = {
  sourceCasino: "Casino",
  sourceLive: "Live Casino",
  sourceBingo: "Bingo",
  allProviders: "All providers",
  viewAll: "View all",
  carousel: "Carousel",
  gamesCount: "games",
  saveLobby: "Save lobby",
  addCarousel: "Add carousel",
  editLobby: "Edit lobby",
  emptyLobbyTitle: "Your lobby is empty",
  emptyLobbyCopy: "Edit your lobby to create carousels and add games.",
  firstCarouselTitle: "Create your first carousel",
  firstCarouselCopy: "Add a carousel, then search the library and drag games into it.",
  use: "Use",
  delete: "Delete",
  dropGames: "Drop games here from the library.",
  dragToReorder: "Drag to reorder",
  remove: "Remove",
  accountStep: "Account",
  personalStep: "Personal details",
  addressStep: "Address",
  preferencesStep: "Preferences",
  accountHelper: "Start with secure sign-in details.",
  personalHelper: "Keep this aligned with the account verification flow.",
  addressHelper: "A compact address capture for the concept flow.",
  preferencesHelper: "Marketing and responsible play choices.",
  emailAddress: "Email address",
  password: "Password",
  firstName: "First name",
  lastName: "Last name",
  dateOfBirth: "Date of birth",
  mobileNumber: "Mobile number",
  postcode: "Postcode",
  addressLine1: "Address line 1",
  townOrCity: "Town or city",
  favouritePlayStyle: "Favourite play style",
  marketing: "Send me offers and updates",
  ageConfirm: "I confirm I am 18 or over",
  termsAccept: "I accept the terms and privacy policy",
  slotsAndJackpots: "Slots and jackpots",
  bingoRooms: "Bingo rooms",
  lotteryDraws: "Lottery draws",
  createAccountShort: "Create account",
  tellUsAboutYou: "Tell us about you",
  compactRegistration: "A compact registration form using the shared account field set.",
  completeConcept: "Complete concept flow",
  stepOf: "Step {current} of {total}",
  back: "Back",
  continue: "Continue",
  conceptComplete: "Concept flow complete",
  noDataSubmitted: "No data has been submitted. This confirms the prototype registration journey only.",
  close: "Close",
  welcomeBack: "Welcome back to Impossible",
  loginCopy: "Log in to your account{suffix}",
  continuePlaying: " to continue playing.",
  newToImpossible: "New to Impossible?",
  join: "Join",
  signedInTitle: "You're signed in for the prototype",
  signedInCopy: "No account data has been submitted. This dummy login confirms the concept flow.",
  backToGames: "Back to games",
  stars: "Stars",
  ticketStatus: "{numbers}/5 numbers · {stars}/2 stars",
  yourTicket: "Your ticket",
  checkoutReady: "Ready for checkout.",
  fillLine: "Fill in at least one complete line to checkout.",
  drawDays: "Draw days",
  weeks: "Weeks",
  completeLines: "Complete lines",
  autoRenew: "Auto-renew",
  total: "Total",
  on: "On",
  off: "Off",
  tuesday: "Tuesday",
  friday: "Friday",
  tuesdayFriday: "Tuesday and Friday",
  goCheckout: "Go to checkout",
  clearLine: "Clear line {number}",
  randomLine: "Random numbers for line {number}",
  checkoutReadyButton: "Checkout ready",
  play: "Play",
  createPassword: "Create a demo password",
  loadingGames: "Loading games...",
  catalogueLoaded: "Live catalogue loaded.",
  fallbackContent: "Using fallback concept content.",
  fallbackHint: "Open the source site first if the catalogue is empty"
};

const ROUTE_LABELS = {
  home: "Home",
  "my-casino": "My Casino",
  games: "Games",
  live: "Live Casino",
  bingo: "Bingo",
  lotteries: "Lotteries",
  promos: "Promotions",
  help: "Help Centre",
  "ai-backlog": "Backlog",
  "ai-markets": "Markets",
  "ai-knowledge": "Knowledge",
  "ai-studio": "Studio",
  "ai-widgets": "Components",
  "ai-suggestions": "UX",
  "ai-experiment": "Experiment",
  "ai-automation": "Automation",
  analytics: "Intelligence",
  documentation: "Knowledge archive",
  account: "Account"
};

const TRACK_LABELS = {
  "save-lobby": "Save lobby",
  "add-carousel": "Add carousel",
  "edit-lobby": "Edit lobby",
  "select-carousel": "Use",
  "delete-carousel": "Delete",
  "remove-game": "Remove",
  "clear-all": "Clear all",
  checkout: "Go to checkout"
};

const TRANSLATION_CACHE = new Map();

const OFFICIAL_GAME_IMAGE_BASE = "https://beta.lottoland.co.uk/scs/games/omni-content/public/v3/game-image/en_GB";
const officialGameImage = (gameId) => `${OFFICIAL_GAME_IMAGE_BASE}/${gameId}/background.png`;

const bingoFallbackImages = [
  "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJvYXV0aCI6eyJjbGllbnRfaWQiOiJjbGllbnQtZmhweXV6cXNtcm8xYm56NiJ9LCJwYXRoIjoibG90dG9sYW5kXC9maWxlXC9CNWc1Vk1vVkFpVTZ6aU1IaFE5Uy5qcGcifQ:lottoland:1JUhC7WmKwsBS19ssaLXrXGvVKDQ5gpRk4-P9WxyaDo?type=jpg&width=320&quality=75",
  "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJvYXV0aCI6eyJjbGllbnRfaWQiOiJjbGllbnQtZmhweXV6cXNtcm8xYm56NiJ9LCJwYXRoIjoibG90dG9sYW5kXC9hY2NvdW50c1wvMDlcLzQwMDA4MzBcL3Byb2plY3RzXC83XC9hc3NldHNcLzYxXC83Mzc5MVwvOTdjMzg0ZWNkZGI5YjcyZjllMTI2ZTY5MzEyNzhiZTYtMTY1MDUzNjgyNi5wbmcifQ:lottoland:ob7WOPaNijk919eKGrEIVqDjn2sQtBDcn-K-BMCnufY?width=320&type=png",
  "https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJvYXV0aCI6eyJjbGllbnRfaWQiOiJjbGllbnQtZmhweXV6cXNtcm8xYm56NiJ9LCJwYXRoIjoibG90dG9sYW5kXC9hY2NvdW50c1wvMDlcLzQwMDA4MzBcL3Byb2plY3RzXC83XC9hc3NldHNcL2EwXC83Mzc4OVwvYmRmNzExODdiODRlZjM5MjAzZGMxZGIyZTkzYTZiYTYtMTY1MDUzNjgyNi5wbmcifQ:lottoland:qd4B52vr6FaNTWEmcbwhwbvkmf1xcD7gMnxn0BxVfUw?width=320&type=png"
];

const fallbackGames = [
  {
    id: "starburst",
    source: "casino",
    name: "Starburst",
    provider: "NetEnt",
    image: officialGameImage("Starburst"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "wolf-gold",
    source: "casino",
    name: "Wolf Gold",
    provider: "Pragmatic",
    image: officialGameImage("WolfGold"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "big-bass-splash",
    source: "casino",
    name: "Big Bass Splash",
    provider: "Pragmatic",
    image: officialGameImage("BigBassSplash"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "big-bass-bonanza",
    source: "casino",
    name: "Big Bass Bonanza",
    provider: "Pragmatic",
    image: officialGameImage("BigBassBonanza"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "gates-olympus",
    source: "casino",
    name: "Gates of Olympus",
    provider: "Pragmatic",
    image: officialGameImage("GatesOfOlympus1000"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "gates-olympus-1000",
    source: "casino",
    name: "Gates of Olympus 1000",
    provider: "Pragmatic",
    image: officialGameImage("GatesOfOlympus"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "big-bass-boxing-bonus-round",
    source: "casino",
    name: "Big Bass Boxing Bonus Round",
    provider: "Pragmatic",
    image: officialGameImage("BigBassBoxingBonusRound"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "book-of-dead",
    source: "casino",
    name: "Book of Dead",
    provider: "Play'n GO",
    image: officialGameImage("BookOfDead"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "777-strike",
    source: "casino",
    name: "777 Strike",
    provider: "Red Tiger",
    image: officialGameImage("777Strike"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "aliens-among-us",
    source: "casino",
    name: "Aliens Among Us",
    provider: "Hacksaw",
    image: officialGameImage("AliensAmongUs"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "double-bubble",
    source: "casino",
    name: "Double Bubble",
    provider: "Anaxi",
    image: officialGameImage("DoubleBubble"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "shark-boss",
    source: "casino",
    name: "Shark Boss",
    provider: "Lottoland",
    image: officialGameImage("BrandedSharkBoss"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "live-roulette",
    source: "live",
    name: "Live Roulette",
    provider: "Evolution",
    image: officialGameImage("LiveRoulette"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "lightning-blackjack",
    source: "live",
    name: "Lightning Blackjack",
    provider: "Evolution",
    image: officialGameImage("LiveLightningBlackjack"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "dream-catcher",
    source: "live",
    name: "Dream Catcher",
    provider: "Evolution",
    image: officialGameImage("DreamCatcher"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "live-blackjack",
    source: "live",
    name: "Live Blackjack",
    provider: "Evolution",
    image: officialGameImage("LiveBlackjack"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "blackjack",
    source: "live",
    name: "Blackjack",
    provider: "Evolution",
    image: officialGameImage("Blackjack"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "speed-roulette",
    source: "live",
    name: "Speed Roulette",
    provider: "Evolution",
    image: officialGameImage("SpeedRoulette"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "live-baccarat",
    source: "live",
    name: "Live Baccarat",
    provider: "Evolution",
    image: officialGameImage("LiveBaccarat"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "live-dragon-tiger",
    source: "live",
    name: "Live Dragon Tiger",
    provider: "Evolution",
    image: officialGameImage("LiveDragonTiger"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "dragon-tiger",
    source: "live",
    name: "Dragon Tiger",
    provider: "Evolution",
    image: officialGameImage("DragonTiger"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "live-casino-holdem",
    source: "live",
    name: "Live Casino Hold'em",
    provider: "Evolution",
    image: officialGameImage("LiveCasinoHoldem"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "bingo-room",
    source: "bingo",
    name: "Big Bass Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "powerful-bingo",
    source: "bingo",
    name: "Powerful Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "hype-drop-pots",
    source: "bingo",
    name: "Hype - Drop Pots",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "bingo-blast",
    source: "bingo",
    name: "Bingo Blast",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "diamond-dazzle",
    source: "bingo",
    name: "Diamond Dazzle",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "laughter-bingo",
    source: "bingo",
    name: "Laughter Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "chill-bingo",
    source: "bingo",
    name: "Chill Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "energy-bingo",
    source: "bingo",
    name: "Energy Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "sparkle-bingo",
    source: "bingo",
    name: "Sparkle Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "rainbow-bingo",
    source: "bingo",
    name: "Rainbow Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "fishin-frenzy-even-bigger-fish",
    source: "casino",
    name: "Fishin' Frenzy Even Bigger Fish",
    provider: "Blueprint",
    image: officialGameImage("FishinFrenzyEvenBiggerFish"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "big-catch-even-bigger-bass",
    source: "casino",
    name: "Big Catch Even Bigger Bass",
    provider: "Blueprint",
    image: officialGameImage("BigCatchEvenBiggerBass"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "cash-strike-hotstepper",
    source: "casino",
    name: "Cash Strike Hotstepper",
    provider: "Blueprint",
    image: officialGameImage("CashStrikeHotstepper"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "luxor-cleopatra",
    source: "casino",
    name: "Luxor Cleopatra",
    provider: "Pragmatic",
    image: officialGameImage("LuxorCleopatra"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "crabbys-gold-ii",
    source: "casino",
    name: "Crabby's Gold II",
    provider: "Red Tiger",
    image: officialGameImage("CrabbysGoldII"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "piggy-riches-megaways",
    source: "casino",
    name: "Piggy Riches Megaways",
    provider: "Red Tiger",
    image: officialGameImage("PiggyRichesMegaways"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "railroad-robbery",
    source: "casino",
    name: "Railroad Robbery",
    provider: "Relax",
    image: officialGameImage("RailroadRobbery"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "brawl-gods",
    source: "casino",
    name: "Brawl Gods",
    provider: "Hacksaw",
    image: officialGameImage("BrawlGods"),
    playUrl: "https://beta.lottoland.co.uk/casino"
  },
  {
    id: "crazy-time",
    source: "live",
    name: "Crazy Time",
    provider: "Evolution",
    image: officialGameImage("CrazyTime"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "monopoly-live",
    source: "live",
    name: "Monopoly Live",
    provider: "Evolution",
    image: officialGameImage("MonopolyLive"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "mega-ball",
    source: "live",
    name: "Mega Ball",
    provider: "Evolution",
    image: officialGameImage("MegaBall"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "infinite-blackjack",
    source: "live",
    name: "Infinite Blackjack",
    provider: "Evolution",
    image: officialGameImage("InfiniteBlackjack"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "free-bet-blackjack",
    source: "live",
    name: "Free Bet Blackjack",
    provider: "Evolution",
    image: officialGameImage("FreeBetBlackjack"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "immersive-roulette",
    source: "live",
    name: "Immersive Roulette",
    provider: "Evolution",
    image: officialGameImage("ImmersiveRoulette"),
    playUrl: "https://beta.lottoland.co.uk/live-casino"
  },
  {
    id: "bingo-bonanza",
    source: "bingo",
    name: "Bingo Bonanza",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "club-bingo",
    source: "bingo",
    name: "Club Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "lucky-stars-bingo",
    source: "bingo",
    name: "Lucky Stars Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "cash-cubes-bingo",
    source: "bingo",
    name: "Cash Cubes Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "wonder-bingo",
    source: "bingo",
    name: "Wonder Bingo",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "bingo-royale",
    source: "bingo",
    name: "Bingo Royale",
    provider: "Bingo",
    image: bingoFallbackImages[0],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "bingo-night",
    source: "bingo",
    name: "Bingo Night",
    provider: "Bingo",
    image: bingoFallbackImages[1],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  },
  {
    id: "bingo-party",
    source: "bingo",
    name: "Bingo Party",
    provider: "Bingo",
    image: bingoFallbackImages[2],
    playUrl: "https://beta.lottoland.co.uk/bingo"
  }
];

const statusNode = document.querySelector("[data-status]");
const countNode = document.querySelector("[data-count]");
const providerSelect = document.querySelector('[data-builder-field="provider"]');
const libraryCount = document.querySelector("[data-library-count]");
const libraryList = document.querySelector("[data-library-list]");
const gameLibrary = document.querySelector(".game-library");
const carouselBuilder = document.querySelector("[data-carousel-builder]");
const builderWorkspace = document.querySelector(".builder-workspace");
const builderActions = document.querySelector("[data-builder-actions]");
const builderIntro = document.querySelector("[data-builder-intro]");
const cardTemplate = document.getElementById("game-card-template");
const libraryCardTemplate = document.getElementById("library-card-template");
const registerModal = document.querySelector("[data-register-modal]");
const registerForm = document.querySelector("[data-register-form]");
const loginModal = document.querySelector("[data-login-modal]");
const loginForm = document.querySelector("[data-login-form]");
const lobbyTitleDisplay = document.querySelector("[data-lobby-title-display]");
const lobbyTitleInput = document.querySelector('[data-builder-field="lobby-title"]');
const myCasinoNavLink = document.querySelector('[data-route-link="my-casino"]');
const lotteryTicketsNode = document.querySelector("[data-lottery-tickets]");
const lotterySummaryNode = document.querySelector("[data-lottery-summary]");
const suggestionListNode = document.querySelector("[data-suggestion-list]");
const experimentDashboardNode = document.querySelector("[data-experiment-dashboard]");
const analyticsDashboardNode = document.querySelector("[data-analytics-dashboard]");
const analyticsSummaryNode = document.querySelector("[data-analytics-summary]");
const analyticsFilterBarNode = document.querySelector(".analytics-filter-bar");
const studioPromptNode = document.querySelector("[data-studio-prompt]");
const studioScopeNode = document.querySelector("[data-studio-scope]");
const studioSafetyNode = document.querySelector("[data-studio-safety]");
const studioStatusNode = document.querySelector("[data-studio-status]");
const studioPreviewNode = document.querySelector("[data-studio-preview]");
const studioHistoryNode = document.querySelector("[data-studio-history]");
const studioDockNode = document.querySelector("[data-studio-dock]");
const studioDockPromptNode = document.querySelector("[data-dock-prompt]");
const studioDockScopeNode = document.querySelector("[data-dock-scope]");
const studioDockContextNode = document.querySelector("[data-studio-context]");
const widgetPreviewNode = document.querySelector("[data-widget-preview]");
const featurePreviewNode = document.querySelector("[data-feature-preview]");
const widgetSummaryNode = document.querySelector("[data-widget-summary]");
const suggestionSummaryNode = document.querySelector("[data-suggestion-summary]");
const experimentSummaryNode = document.querySelector("[data-experiment-summary]");
const languageSelect = document.querySelector("[data-language-select]");
const brandSummaryNode = document.querySelector("[data-brand-summary]");
const brandDetailNode = document.querySelector("[data-brand-detail]");
const marketSummaryNode = document.querySelector("[data-market-summary]");
const marketDetailNode = document.querySelector("[data-market-detail]");
const knowledgeSummaryNode = document.querySelector("[data-knowledge-summary]");
const knowledgeDetailNode = document.querySelector("[data-knowledge-detail]");
const automationSummaryNode = document.querySelector("[data-automation-summary]");
const automationDetailNode = document.querySelector("[data-automation-detail]");
const workspaceBacklogNode = document.querySelector("[data-workspace-backlog]");
const workspaceBacklogPageNode = document.querySelector("[data-workspace-backlog-page]");

const SITE_BRANDS = [
  {
    id: "bubblegum",
    name: "Bubble Gum",
    status: "Selected",
    tone: "Playful casino",
    assets: "Elephant, neon star, candy gradients",
    palette: ["#35116f", "#9135cf", "#ff4fb8", "#ffe85c", "#fff1fb"],
    description: "The current Impossible Casino world: soft purple clouds, bright pink actions, yellow badges and the elephant/star hero treatment.",
    logoText: "Impossible",
    ribbonText: "Casino",
    images: {
      mark: "assets/impossible-elephant-hero.png",
      hero: "assets/impossible-elephant-hero.png"
    },
    tokens: {
      primary: "#5520a0",
      primaryDeep: "#35116f",
      accent: "#ff4fb8",
      highlight: "#ffe85c",
      panel: "#fff8fe",
      surface: "#fff1fb"
    },
    assetStrategy: "Use the elephant as the friendly mascot, keep the star sparkle, and favour rounded candy panels."
  },
  {
    id: "dark-technical",
    name: "Techno Casino",
    status: "Available",
    tone: "Premium systems",
    assets: "Impossible triangle, neon grid, glass panels",
    palette: ["#07101f", "#0d2846", "#16d9ff", "#67e8ff", "#f4fbff"],
    description: "A sharper casino operating-system look with dark glass, cyan highlights and more technical framing.",
    logoText: "Techno",
    ribbonText: "Casino",
    images: {
      mark: "assets/dark-technical-mark.svg",
      hero: "assets/dark-technical-hero.svg"
    },
    tokens: {
      primary: "#0d2846",
      primaryDeep: "#07101f",
      accent: "#16d9ff",
      highlight: "#67e8ff",
      panel: "#f4fbff",
      surface: "#eaf7ff"
    },
    assetStrategy: "Use a dedicated impossible-triangle mark, neon grid and glass geometry. No animal or mascot imagery is used in this brand."
  },
  {
    id: "lottoland",
    name: "Lottoland",
    status: "Available",
    tone: "Trusted big-win entertainment",
    assets: "Green wordmark, navy shell, promo hero",
    palette: ["#050b2d", "#111c49", "#35f773", "#ffffff", "#ff3f70"],
    description: "A Lottoland-inspired brand pack with deep navy pages, bright green actions, crisp white typography and a more direct promotional casino feel.",
    logoText: "Lottoland",
    ribbonText: "",
    images: {
      mark: "assets/lottoland-mark.svg",
      hero: "assets/lottoland-hero.svg"
    },
    tokens: {
      primary: "#111c49",
      primaryDeep: "#050b2d",
      accent: "#35f773",
      highlight: "#ffffff",
      panel: "#111c49",
      surface: "#050b2d"
    },
    assetStrategy: "Use a green wordmark, dark navy shell, bright payout-style highlight bar and promotional hero artwork. No Impossible elephant assets are used."
  }
];

const PLAYAI_MARKETS = [
  {
    id: "market-impossible-uk",
    name: "Impossible UK",
    status: "Active",
    region: "United Kingdom",
    launch: "Impossible Casino",
    defaultBrand: "Bubble Gum",
    brands: ["Bubble Gum", "Techno Casino", "Lottoland"],
    knowledge: ["UK registration requirements", "Cookie consent requirements", "Game tile data contract", "Theme rules"],
    components: [
      { name: "Deposit limits", setting: "On after registration", source: "Deposit limits Knowledge", control: "Market controlled", status: "Active" },
      { name: "Lottery guide", setting: "Off", source: "Lottery guide Knowledge", control: "Market controlled", status: "Off" },
      { name: "Cookie banner", setting: "Pending implementation", source: "Cookie consent Knowledge", control: "Market required", status: "Pending" }
    ],
    detail: "UK concept market using the beta.lottoland.co.uk catalogue as the source for game metadata and images.",
    source: "beta.lottoland.co.uk",
    regulatoryProfile: "UKGC and UK GDPR/PECR"
  }
];

const PLAYAI_KNOWLEDGE_DOCUMENTS = [
  {
    id: "knowledge-uk-registration",
    title: "UK registration requirements",
    area: "Compliance",
    owner: "Compliance",
    status: "Implemented",
    market: "Impossible UK",
    summary: "Defines the site requirements that must appear in the UK registration journey.",
    requirements: [
      "Registration must collect email, password, first name, last name, date of birth, mobile number, postcode, address line 1, town or city and play preference.",
      "Registration must include an explicit 18+ confirmation checkbox before completion.",
      "Registration must include a Terms and Conditions acknowledgement checkbox before completion.",
      "Registration must include a Privacy Policy acknowledgement checkbox before completion.",
      "Registration field order and step order must be defined in Knowledge so the form can be reviewed without reading code.",
      "Every required registration field must define validation behaviour and friendly helper text.",
      "Invalid field entries must show red helper text directly under the relevant field, using the active site brand typography and spacing.",
      "Marketing consent must be separate from terms, privacy and age confirmation.",
      "Post-registration deposit limits must remain available as a market-controlled feature switch.",
      "Visible form language may change by site language, but tracking names and funnel labels must remain in English."
    ],
    implementation: [
      "Registration overlay",
      "Registration A/B test",
      "Deposit limit feature switch",
      "Footer legal links",
      "AI Intelligence registration funnel"
    ],
    prompt: "Update the Impossible UK registration journey so UK compliance requirements are explicit: separate Terms and Conditions, Privacy Policy and 18+ checkboxes, marketing consent as an optional separate choice, and preserve English analytics labels."
  },
  {
    id: "knowledge-cookie-consent",
    title: "Cookie banner component",
    area: "Components",
    owner: "Compliance",
    status: "Pending implementation",
    market: "Impossible UK",
    summary: "Defines the requirements for a future consent widget. This is a Knowledge-driven prompt source, not yet a deployed site feature.",
    requirements: [
      "The site must present a cookie consent banner before non-essential analytics, personalisation or marketing cookies are enabled.",
      "The banner must support Accept all, Reject non-essential and Manage choices actions.",
      "Manage choices must let the user control cookie categories such as Strictly necessary, Analytics, Personalisation and Marketing.",
      "Strictly necessary cookies must be described as always on.",
      "The footer must provide a Cookie settings link so the customer can reopen choices later.",
      "Consent state must be stored and respected on future visits.",
      "PlayAI tools may keep their own demo telemetry, but customer-site tracking should honour the site consent state when this requirement is implemented."
    ],
    implementation: [
      "Cookie consent widget",
      "Footer Cookie settings link",
      "Analytics gating",
      "Knowledge status check"
    ],
    prompt: "Create a customer-site cookie consent widget for Impossible UK. Add Accept all, Reject non-essential and Manage choices. Include Strictly necessary, Analytics, Personalisation and Marketing categories, store the consent choice, add a Cookie settings link to the footer, and gate customer-site analytics until consent allows it. Keep PlayAI tools in English."
  },
  {
    id: "knowledge-deposit-limits",
    title: "Deposit limits component",
    area: "Components",
    owner: "Compliance",
    status: "Implemented",
    market: "Impossible UK",
    summary: "Defines the post-registration deposit limit component for markets where safer gambling prompts are required or useful.",
    requirements: [
      "The component must be controlled by market and feature switch state.",
      "UK journeys should invite customers to choose a daily, weekly or monthly deposit limit after registration.",
      "Preset options must include common values and a Custom option.",
      "Quick buttons must show £10, £25 and £50 before the Custom option unless the market Knowledge Base defines different values.",
      "Custom must reveal an input field for the customer to type their own limit.",
      "The component must have a clear Save limit action.",
      "The feature can be disabled or made optional for other markets.",
      "Tracking should record component display, selected preset/custom and save action in English."
    ],
    implementation: [
      "Feature switch",
      "Post-registration prompt",
      "Custom amount input",
      "Knowledge status check"
    ],
    prompt: "Audit the Deposit limits component for Impossible UK. Confirm it is market controlled, includes daily/weekly/monthly periods, preset options, a Custom amount input, and English tracking for display, selection and save actions."
  },
  {
    id: "knowledge-lottery-guide",
    title: "Lottery guide component",
    area: "Components",
    owner: "Product",
    status: "Implemented",
    market: "Impossible UK",
    summary: "Defines the guided lottery helper popup that helps customers understand ticket completion.",
    requirements: [
      "The guide must appear as a popup over the lottery page, not as inline page content.",
      "The guide must be multi-step because ticket completion has several concepts.",
      "The guide must explain selecting five main numbers.",
      "The guide must explain selecting two stars or extra numbers.",
      "The guide must explain dice/random selection and quick picks.",
      "The guide must explain draw days, weeks, auto-renew and checkout readiness.",
      "The widget must support Show once and Always show modes.",
      "The component visual style must come from the active customer brand."
    ],
    implementation: [
      "Lottery helper widget",
      "Widget summary",
      "Lottery page overlay",
      "Theme-aware modal"
    ],
    prompt: "Audit the Lottery guide component. Keep it as a multi-step popup over the lottery page, support Show once and Always show settings, and ensure the modal style is driven by the active customer brand."
  },
  {
    id: "knowledge-game-tile",
    title: "Game tile data contract",
    area: "Components",
    owner: "Product engineering",
    status: "Implemented",
    market: "Impossible UK",
    summary: "Defines what every game tile must render, independent of brand styling.",
    requirements: [
      "Game tiles must use the live catalogue source configured for the market, currently beta.lottoland.co.uk.",
      "Game imagery must come from the catalogue source, not generated placeholder art.",
      "The game title must be displayed using the catalogue display name rather than an internal id.",
      "The provider name must be displayed when catalogue metadata provides it.",
      "The game type must be shown as a badge, for example Casino, Live Casino or Bingo.",
      "A red heart indicator must appear when the game is already in My Casino or otherwise marked as a favourite.",
      "Tiles must remain clickable as the launch action; separate Play buttons are not required on the tile component.",
      "The site should record when a customer clicks a game tile.",
      "The click record should include whether the game was already in My Casino or marked as a favourite at the time of the click.",
      "The click record should include the visible game type, provider and current site page so later reporting can compare behaviour."
    ],
    implementation: [
      "Game card component",
      "Game catalogue adapter",
      "My Casino favourite indicator",
      "Lobby carousels",
      "Game library"
    ],
    prompt: "Audit the Impossible UK game tile component against the Game tile data contract. Ensure source catalogue images, display names, provider names, game type badges and red My Casino/favourite hearts render consistently across lobbies and the My Casino library."
  },
  {
    id: "knowledge-game-reporting",
    title: "Game engagement reporting",
    area: "Reporting",
    owner: "Product",
    status: "Pending implementation",
    market: "Impossible UK",
    summary: "Defines the human-readable reporting output for game engagement, separate from the tile tracking requirements.",
    requirements: [
      "The dashboard should show which games receive the most tile clicks.",
      "The dashboard should compare clicks where the game was already in My Casino or favourited against clicks where it was not.",
      "The dashboard should allow the reviewer to view game engagement by page, game type and provider.",
      "The dashboard should include a bar chart for most-clicked games.",
      "The dashboard should include a pie or donut chart showing favourite versus non-favourite clicks.",
      "The dashboard should include a trend view if enough events exist over time.",
      "Reporting labels should stay in English even when the site is shown in another language."
    ],
    implementation: [
      "AI Intelligence games dashboard",
      "Game tile analytics",
      "Favourite-state reporting"
    ],
    prompt: "Create a Game engagement dashboard for Impossible UK. Use existing game tile click events and add any missing favourite-state tracking needed to compare clicks on games already in My Casino versus other games. Show most-clicked games as a bar chart, favourite versus non-favourite clicks as a donut chart, and a trend view when enough events exist."
  },
  {
    id: "knowledge-site-event-collection",
    title: "Site event collection contract",
    area: "Measurement",
    owner: "Product",
    status: "Active",
    market: "Impossible UK",
    summary: "Defines what customer-site behaviour should be recorded before any dashboard decides how to visualise it.",
    requirements: [
      "Customer-site event names must be stored in English even when the visible site language changes.",
      "Events must identify the customer route, component, interaction type and active brand.",
      "Primary navigation clicks must record the destination route in English.",
      "Registration events must record start, step views, field progress, validation errors and completion in English.",
      "Login events must record start, email field interaction, password field interaction and continue button interaction in English.",
      "Game tile clicks must record game name, provider, game type, route and whether the game is already in My Casino or favourited.",
      "Lottery events must record ticket card completion, dice usage, quick-pick usage, draw-day choice, duration choice, auto-renew choice and checkout readiness.",
      "Offer experiment events must record the shown offer, CTA clicks and resulting registration or login handoff.",
      "PlayAI workspace activity must be excluded from customer-site analytics unless a specific workspace dashboard asks for tool usage.",
      "Collection requirements must not dictate chart type; reporting Knowledge documents define visual output separately."
    ],
    implementation: [
      "Local analytics adapter",
      "Route tracking",
      "Registration and login funnels",
      "Lottery tracking",
      "Offer experiment tracking"
    ],
    prompt: "Audit Impossible UK customer-site event collection. Keep event labels in English, exclude PlayAI workspace activity from site dashboards, and ensure route, component, interaction type, brand, registration, login, game, lottery and offer experiment signals are captured without hard-coding dashboard visuals into the collection layer."
  },
  {
    id: "knowledge-reporting-dashboard",
    title: "Dashboard reporting output",
    area: "Reporting",
    owner: "Product",
    status: "Active",
    market: "Impossible UK",
    summary: "Defines how collected events should become readable dashboards for reviewers.",
    requirements: [
      "Reporting documents must describe the question a reviewer is trying to answer before specifying charts.",
      "Dashboards should use compact summary metrics for totals, conversion rates and pending actions.",
      "Funnels should show count, percent from first step and percent from previous step.",
      "Route and navigation dashboards should support bar charts and share charts where useful.",
      "Game engagement dashboards should support most-selected games, provider breakdown and favourite-state comparisons.",
      "Lottery dashboards should support duration, draw-day, dice-use and quick-pick breakdowns.",
      "Experiment dashboards should show status, sample size, conversion, time to convert, significance signal, outcome and interaction warnings.",
      "Dashboard list views should scale by showing summary rows first, with details opened from the selected row.",
      "Reporting labels should remain in English for consistent analysis across language variants."
    ],
    implementation: [
      "Intelligence dashboards",
      "Experiment summaries",
      "Funnel charts",
      "List-detail dashboard pattern"
    ],
    prompt: "Review the Impossible UK Intelligence dashboards against the reporting Knowledge document. Keep collection requirements separate from chart output, make dashboards answer clear reviewer questions, and ensure funnels, navigation, games, lotteries and experiments use scalable list-detail reporting patterns with English labels."
  },
  {
    id: "knowledge-theme-rules",
    title: "Theme and brand rules",
    area: "Brand",
    owner: "Design",
    status: "Active",
    market: "Impossible UK",
    summary: "Defines which visual choices belong to brand themes rather than component contracts.",
    requirements: [
      "Component documents define required data and behaviour; brand documents define visual treatment.",
      "Bubble Gum owns the elephant asset, candy-purple surfaces, pink actions, yellow accents and playful star treatment.",
      "Techno Casino owns dark checked surfaces, cyan actions, technical grid backgrounds and non-elephant assets.",
      "Lottoland owns navy surfaces, bright green actions, Lottoland-style logo treatment and Lottoland-style campaign imagery.",
      "Badge colour, text placement, heart position, panel treatment and decorative motifs must come from the active brand.",
      "No Bubble Gum purple, elephant imagery or candy panels should leak into Techno Casino or Lottoland.",
      "No PlayAI blue grid styling should leak into the customer site."
    ],
    implementation: [
      "Brand switchboard",
      "CSS brand tokens",
      "Brand asset mapping",
      "Site QA"
    ],
    prompt: "Run a brand-leak audit for Impossible UK. Keep game tile behaviour consistent but ensure visual choices such as badge colour, text placement, heart position, panel treatment and decorative motifs are driven only by the selected brand."
  },
  {
    id: "knowledge-footer-legal",
    title: "Footer legal and safer gambling requirements",
    area: "Compliance",
    owner: "Compliance",
    status: "Implemented",
    market: "Impossible UK",
    summary: "Defines the footer content required to support safer gambling and legal navigation.",
    requirements: [
      "Footer must include 18+ messaging.",
      "Footer must include safer gambling copy in plain customer-friendly language.",
      "Footer must link to Help Centre, Safer Gambling, Deposit Limits, Self Exclusion, Terms and Conditions and Privacy Policy.",
      "Footer must reference GamCare, the National Gambling Helpline and GAMSTOP for UK safer gambling support.",
      "Footer language selector must affect only customer-site text, not PlayAI screens.",
      "When cookie consent is implemented, footer must include a Cookie settings link."
    ],
    implementation: [
      "Site footer",
      "Help Centre",
      "Language selector",
      "Cookie consent requirement"
    ],
    prompt: "Audit the Impossible UK footer against the legal and safer gambling Knowledge document. Keep customer copy friendly, include required support links and add Cookie settings when the cookie consent widget is implemented."
  }
];

const registrationSteps = [
  {
    title: "Account",
    helper: "Start with secure sign-in details.",
    fields: [
      { id: "email", label: "Email address", type: "text", placeholder: "Email address", autocomplete: "off", inputmode: "email" },
      { id: "password", label: "Password", type: "password", placeholder: "Create a demo password", autocomplete: "off" }
    ]
  },
  {
    title: "Personal details",
    helper: "Keep this aligned with the account verification flow.",
    fields: [
      { id: "firstName", label: "First name", type: "text", placeholder: "First name", autocomplete: "given-name" },
      { id: "lastName", label: "Last name", type: "text", placeholder: "Last name", autocomplete: "family-name" },
      { id: "dateOfBirth", label: "Date of birth", type: "date", placeholder: "", autocomplete: "bday" },
      {
        id: "phone",
        label: "Mobile number",
        type: "tel",
        placeholder: "07...",
        autocomplete: "tel"
      }
    ]
  },
  {
    title: "Address",
    helper: "A compact address capture for the concept flow.",
    fields: [
      { id: "postcode", label: "Postcode", type: "text", placeholder: "Postcode", autocomplete: "postal-code" },
      { id: "address1", label: "Address line 1", type: "text", placeholder: "House and street", autocomplete: "address-line1" },
      { id: "city", label: "Town or city", type: "text", placeholder: "Town or city", autocomplete: "address-level2" }
    ]
  },
  {
    title: "Preferences",
    helper: "Marketing and responsible play choices.",
    fields: [
      {
        id: "playStyle",
        label: "Favourite play style",
        type: "select",
        options: ["Slots and jackpots", "Live casino", "Bingo rooms", "Lottery draws"]
      },
      { id: "marketing", label: "Send me offers and updates", type: "checkbox" },
      { id: "ageConfirm", label: "I confirm I am 18 or over", type: "checkbox" },
      { id: "terms", label: "I accept the terms and privacy policy", type: "checkbox" }
    ]
  }
];

let currentGames = [];
let draggedGameId = "";
let draggedFromCarouselId = "";
let draggedCarouselId = "";
let draggedMetricId = "";
let draggedMetricDashboardId = "";
let dashboardEditMode = {};
let pendingPlayUrl = "";
let pendingRegistrationOfferId = "";
let registerVariant = "single";
let registerStep = 0;
let loginFunnelFieldsSeen = new Set();
let builderState = {
  title: "My Casino",
  selectedCarouselId: "",
  search: "",
  source: "all",
  provider: "",
  editMode: true,
  carousels: []
};
let lotteryState = {
  tickets: Array.from({ length: 6 }, () => ({ numbers: [], stars: [] })),
  days: "fri",
  weeks: 1,
  renew: false,
  checkedOut: false
};
let lastTrackedRoute = "";
let siteLanguage = normaliseSiteLanguage(localStorage.getItem(SITE_LANGUAGE_KEY));
let cachedI18nTextNodes = [];
let cachedI18nPlaceholderNodes = [];
let activeOfferId = "";
let lastOfferImpressionRouteKey = "";
let offerExperimentInitialised = false;
let aiUxRenderScheduled = false;
let viewedGameImpressionKeys = new Set();
let lastWidgetImpressionKey = "";
let studioDockDragState = null;
let activePlayAiDetails = {
  "ai-backlog": "",
  "ai-markets": "",
  "ai-knowledge": "",
  "ai-brands": "",
  "ai-widgets": "",
  "ai-suggestions": "",
  "ai-experiment": "",
  "ai-automation": "",
  analytics: ""
};
let activePlayAiListFilters = {};
let activePlayAiListQueries = {};
let activePlayAiListPages = {};
let activeBacklogEditId = "";
let activeKnowledgeEditId = "";
let workspaceBacklogSourceItems = [];
let workspaceBacklogSourceStatus = "code-fallback";
let workspaceBacklogApiAvailable = false;

languageSelect?.addEventListener("change", handleLanguageChange);
document.addEventListener("click", handleRepeatedClickCapture, true);
document.addEventListener("click", handleGameNavigation);
document.addEventListener("click", handleLobbyViewToggle);
document.addEventListener("click", handleLoginClick);
document.addEventListener("submit", handleLoginSubmit);
document.addEventListener("click", handleRegistrationClick);
document.addEventListener("click", handleLotteryClick);
document.addEventListener("click", handleAiStudioClick);
document.addEventListener("click", handleStudioDockClick);
document.addEventListener("click", handleWorkspaceClick);
document.addEventListener("click", handleAiUxClick);
document.addEventListener("click", handleWidgetClick);
document.addEventListener("click", handlePlayAiListNavigation);
document.addEventListener("click", handlePrototypeNavigationClick);
document.addEventListener("click", handlePrimaryNavigationClick);
document.addEventListener("click", handleBuilderClick);
document.addEventListener("input", handleBuilderInput);
document.addEventListener("input", handleAiStudioInput);
document.addEventListener("input", handleWidgetInput);
document.addEventListener("input", handlePlayAiListControls);
document.addEventListener("change", handleAnalyticsFilterChange);
document.addEventListener("change", handleFeatureSwitchChange);
document.addEventListener("change", handlePlayAiListControls);
document.addEventListener("focusin", handleLoginFieldFocus);
document.addEventListener("change", handleBuilderChange);
document.addEventListener("change", handleLotteryChange);
document.addEventListener("pointerdown", handleStudioDockPointerDown);
document.addEventListener("pointermove", handleStudioDockPointerMove);
document.addEventListener("pointerup", handleStudioDockPointerUp);
document.addEventListener("pointercancel", handleStudioDockPointerUp);
document.addEventListener("dragstart", handleDragStart);
document.addEventListener("dragend", clearDragState);
document.addEventListener("dragover", handleDragOver);
document.addEventListener("drop", handleDrop);
window.addEventListener("hashchange", updateRoute);
document.addEventListener("keydown", handleRegistrationKeydown);
document.addEventListener("keydown", handleGameCardKeydown);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeBubblegumStampedeModal();
});
window.addEventListener("plai:analytics-event", scheduleAiUxRender);
window.addEventListener("impossible:analytics-event", scheduleAiUxRender);

initialisePrototype();

function initialisePrototype() {
  safeStartupStep("route", updateRoute);
  safeStartupStep("brand", applySelectedBrand);
  safeStartupStep("language", applySiteLanguage);
  loadGames().catch((error) => {
    console.warn("Catalogue startup skipped:", error);
    currentGames = fallbackGames;
    safeStartupStep("fallback site render", renderSite);
    renderEmergencyContent();
  });
  loadRegistrationPreference().catch((error) => {
    console.warn("Registration preference skipped:", error);
    registerVariant = "single";
    renderRegistration();
  });
  safeStartupStep("lottery", renderLottery);
  safeStartupStep("AI Studio", loadAiStudioState);
  safeStartupStep("widgets", loadWidgetState);
  safeStartupStep("backlog state", reconcileBacklogState);
  loadWorkspaceBacklogSource().catch((error) => {
    workspaceBacklogSourceStatus = "code-fallback";
    console.warn("Repository backlog source skipped:", error);
  });
  safeStartupStep("prototype tracking", () =>
    trackUxEvent("Prototype Loaded", { prototype: "Impossible Casino" })
  );
  safeStartupStep("offer experiment", () => initialiseHomepageOffer("startup"));
  safeStartupStep("PlayAI panels", renderAiUxViews);
}

function safeStartupStep(name, step) {
  try {
    step();
  } catch (error) {
    console.warn(`${name} startup skipped:`, error);
  }
}

function scheduleAiUxRender() {
  if (aiUxRenderScheduled) return;

  aiUxRenderScheduled = true;
  requestAnimationFrame(() => {
    aiUxRenderScheduled = false;
    renderAiUxViews();
  });
}

function renderEmergencyContent() {
  if (!document.querySelector('[data-grid="featured"] .game-card')) {
    renderEmergencyLobby("featured", fallbackGames);
  }
  if (!document.querySelector('[data-grid="live"] .game-card')) {
    renderEmergencyLobby("live", fallbackGames.filter((game) => game.source === "live"));
  }
  if (!document.querySelector('[data-grid="bingo"] .game-card')) {
    renderEmergencyLobby("bingo", fallbackGames.filter((game) => game.source === "bingo"));
  }
  if (!document.querySelector("[data-lottery-tickets] .lottery-ticket")) {
    safeStartupStep("fallback lottery render", renderLottery);
  }
  if (experimentDashboardNode && !experimentDashboardNode.children.length) {
    safeStartupStep("fallback experiment render", renderExperimentDashboard);
  }
  if (analyticsDashboardNode && !analyticsDashboardNode.children.length) {
    safeStartupStep("fallback intelligence render", renderAnalyticsDashboard);
  }
  if (suggestionListNode && !suggestionListNode.children.length) {
    safeStartupStep("fallback AI UX render", renderSuggestionList);
  }
}

function renderEmergencyLobby(name, games) {
  const container = document.querySelector(`[data-grid="${name}"]`);
  if (!container || !games.length) return;
  const group = document.createElement("section");
  group.className = "lobby-group";
  group.innerHTML = `
    <header>
      <h3>${escapeHtml(name === "featured" ? "Featured favourites" : name === "live" ? "Live favourites" : "Bingo favourites")}</h3>
      <button type="button">${escapeHtml(t("viewAll"))}</button>
    </header>
    <div class="game-rail lobby-rail"></div>
  `;
  group.querySelector(".lobby-rail").replaceChildren(
    ...games.map((game) => createEmergencyGameCard(game, group.querySelector("h3").textContent))
  );
  container.replaceChildren(group);
}

function createEmergencyGameCard(game, sectionName) {
  const card = document.createElement("article");
  card.className = `game-card is-${game.source}`;
  card.dataset.gameId = game.id;
  card.dataset.source = game.source;
  card.dataset.gameName = game.name;
  card.dataset.gameProvider = game.provider;
  card.dataset.sectionName = sectionName;
  card.dataset.playUrl = game.playUrl;
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.setAttribute("aria-label", `${game.name} by ${game.provider}`);
  card.innerHTML = `
    <span class="game-badge">${escapeHtml(displaySourceLabel(game.source))}</span>
    <span class="game-copy">
      <strong>${escapeHtml(game.name)}</strong>
      <small>${escapeHtml(game.provider)}</small>
    </span>
  `;
  card.style.background = placeholderBackground(game.source);
  return card;
}

async function loadRegistrationPreference() {
  const stored = await storageGet("impossibleRegisterVariant");
  registerVariant =
    stored.impossibleRegisterVariant === "stepped" ? "stepped" : "single";
  renderRegistration();
}

function handleLanguageChange(event) {
  const nextLanguage = normaliseSiteLanguage(event.target.value);
  if (nextLanguage === siteLanguage) return;
  siteLanguage = nextLanguage;
  localStorage.setItem(SITE_LANGUAGE_KEY, siteLanguage);
  applySiteLanguage();
  renderSite();
  renderLottery();
  renderRegistration();
  renderLoginForm();
}

function normaliseSiteLanguage(language) {
  return language && (language === "en" || SITE_TRANSLATIONS[language])
    ? language
    : "en";
}

function t(key, replacements = {}) {
  const value = getLanguageDictionary(siteLanguage)[key] || key;
  const replacementEntries = Object.entries(replacements);
  if (!replacementEntries.length) return value;
  const cacheKey = `${siteLanguage}:${key}:${JSON.stringify(replacements)}`;
  if (TRANSLATION_CACHE.has(cacheKey)) return TRANSLATION_CACHE.get(cacheKey);
  const translated = replacementEntries.reduce(
    (text, [name, replacement]) => text.replace(`{${name}}`, replacement),
    value
  );
  TRANSLATION_CACHE.set(cacheKey, translated);
  return translated;
}

function getLanguageDictionary(language) {
  const cacheKey = `dictionary:${language}`;
  if (!TRANSLATION_CACHE.has(cacheKey)) {
    TRANSLATION_CACHE.set(cacheKey, {
      ...SITE_ENGLISH,
      ...(SITE_TRANSLATIONS[language] || {})
    });
  }
  return TRANSLATION_CACHE.get(cacheKey);
}

function cacheLanguageNodes() {
  if (!cachedI18nTextNodes.length) {
    cachedI18nTextNodes = [...document.querySelectorAll("[data-i18n]")];
  }
  if (!cachedI18nPlaceholderNodes.length) {
    cachedI18nPlaceholderNodes = [...document.querySelectorAll("[data-i18n-placeholder]")];
  }
}

function applySiteLanguage() {
  document.documentElement.lang = siteLanguage;
  if (languageSelect) languageSelect.value = siteLanguage;
  cacheLanguageNodes();
  const dictionary = getLanguageDictionary(siteLanguage);
  cachedI18nTextNodes.forEach((node) => {
    if (!node.dataset.i18nDefault) {
      node.dataset.i18nDefault = node.textContent.trim();
    }
    node.textContent =
      siteLanguage !== "en"
        ? dictionary[node.dataset.i18n] || node.dataset.i18nDefault
        : node.dataset.i18nDefault;
  });
  cachedI18nPlaceholderNodes.forEach((node) => {
    if (!node.dataset.i18nPlaceholderDefault) {
      node.dataset.i18nPlaceholderDefault = node.getAttribute("placeholder") || "";
    }
    node.setAttribute(
      "placeholder",
      siteLanguage !== "en"
        ? dictionary[node.dataset.i18nPlaceholder] || node.dataset.i18nPlaceholderDefault
        : node.dataset.i18nPlaceholderDefault
    );
  });
  applyBrandContent();
}

function displaySourceLabel(source) {
  if (source === "casino") return t("sourceCasino");
  if (source === "live") return t("sourceLive");
  if (source === "bingo") return t("sourceBingo");
  return siteLanguage === "es" ? "Juego" : "Game";
}

function gameCountLabel(count) {
  return `${count} ${t("gamesCount")}`;
}

async function loadGames({ force = false } = {}) {
  setStatus(t("loadingGames"));
  if (force) {
    viewedGameImpressionKeys.clear();
  }

  try {
    builderState = await readBuilderState();
    const cached = force ? null : await readCachedGames();
    const games = cached || await requestStaticCatalogue();
    const playableGames = normaliseGames(games);

    if (!playableGames.length) {
      throw new Error("No playable games were found.");
    }

    await cacheGames(playableGames);
    currentGames = playableGames;
    renderSite();
    setStatus(t("catalogueLoaded"), gameCountLabel(playableGames.length));
  } catch (error) {
    console.warn("Plai catalogue failed:", error);
    trackUxEvent("Error Encountered", {
      message: error.message,
      area: "catalogue"
    });
    currentGames = fallbackGames;
    renderSite();
    setStatus(
      t("fallbackContent"),
      t("fallbackHint")
    );
  }
}

async function requestStaticCatalogue() {
  const response = await fetch(`${CATALOGUE_SOURCE_URL}?v=${CATALOGUE_CACHE_VERSION}`, {
    cache: "no-store"
  });
  if (!response.ok) {
    throw new Error(`Catalogue file unavailable (${response.status}).`);
  }

  const payload = await response.json();
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload.games) ? payload.games : [];
}

function requestGames() {
  return new Promise((resolve, reject) => {
    if (!globalThis.chrome?.runtime?.sendMessage) {
      reject(new Error("Chrome extension catalogue bridge unavailable."));
      return;
    }
    try {
      chrome.runtime.sendMessage(
        { type: "my-casino-lobby:load-catalogues" },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }
          if (!response?.ok || !response.games) {
            reject(new Error(response?.error || "Catalogue request failed."));
            return;
          }
          resolve(response.games);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

async function readCachedGames() {
  const stored = await storageGet("impossibleCatalogue");
  const cached = stored.impossibleCatalogue;
  if (!cached || Date.now() - cached.updatedAt > CATALOGUE_CACHE_MAX_AGE_MS) return null;
  if (cached.version !== CATALOGUE_CACHE_VERSION) return null;
  if (!Array.isArray(cached.games) || cached.games.length < CATALOGUE_MIN_EXPECTED_GAMES) {
    return null;
  }
  return cached.games;
}

async function cacheGames(games) {
  await storageSet({
    impossibleCatalogue: {
      version: CATALOGUE_CACHE_VERSION,
      updatedAt: Date.now(),
      games
    }
  });
}

async function readBuilderState() {
  const stored = await storageGet([
    "impossibleMyCasinoBuilder",
    "impossibleMyCasino"
  ]);
  const builder = stored.impossibleMyCasinoBuilder;
  if (builder && Array.isArray(builder.carousels)) {
    return {
      selectedCarouselId: builder.selectedCarouselId || "",
      title: builder.title || "My Casino",
      search: builder.search || "",
      source: builder.source || "all",
      provider: builder.provider || "",
      editMode: builder.editMode !== false,
      carousels: builder.carousels
    };
  }

  const oldIds = Array.isArray(stored.impossibleMyCasino)
    ? stored.impossibleMyCasino
    : [];
  const starterCarousel = oldIds.length
    ? [{ id: createId(), title: "My Favourites", gameIds: oldIds }]
    : [];
  return {
    selectedCarouselId: starterCarousel[0]?.id || "",
    title: "My Casino",
    search: "",
    source: "all",
    provider: "",
    editMode: true,
    carousels: starterCarousel
  };
}

async function saveBuilderState() {
  await storageSet({
    impossibleMyCasinoBuilder: builderState
  });
}

function collectCatalogueGames(payload) {
  const collected = [];
  const visited = new Set();
  const nestedKeys = /games|items|results|catalog|catalogue|entries|tiles|cards|sections|rails|products|rooms|nodes|data|content/i;

  function visit(value, depth = 0) {
    if (!value || depth > 8) return;
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, depth + 1));
      return;
    }
    if (typeof value !== "object") return;
    if (visited.has(value)) return;
    visited.add(value);

    if (isCatalogueGameCandidate(value)) {
      collected.push(value);
    }

    Object.entries(value).forEach(([key, nested]) => {
      if (nestedKeys.test(key)) {
        visit(nested, depth + 1);
      }
    });
  }

  visit(payload);
  return collected;
}

function isCatalogueGameCandidate(game) {
  const name = getGameName(game);
  if (!name) return false;
  return Boolean(
    game.provider ||
      game.studio ||
      game.supplier ||
      game.vendor ||
      game.playUrl ||
      game.url ||
      game.href ||
      game.launchUrl ||
      game.gameUrl ||
      game.path ||
      game.source ||
      game.category ||
      game.type ||
      game.vertical ||
      game.product ||
      pickGameImage(game)
  );
}

function getGameName(game) {
  return (
    game.displayName ||
    game.title ||
    game.gameName ||
    game.name ||
    game.label ||
    game.content?.title ||
    game.metadata?.title ||
    ""
  );
}

function getGameProvider(game, source) {
  return (
    game.provider ||
    game.studio ||
    game.supplier ||
    game.vendor ||
    game.metadata?.provider ||
    game.content?.provider ||
    SOURCE_LABELS[source] ||
    "Game"
  );
}

function getGameRoute(game, source) {
  return (
    game.playUrl ||
    game.url ||
    game.href ||
    game.launchUrl ||
    game.gameUrl ||
    game.path ||
    game.links?.play ||
    game.links?.launch ||
    `/${source === "live" ? "live-casino" : source}`
  );
}

function uniqueGameKey(game) {
  const name = getGameName(game) || game.name || "";
  const provider = getGameProvider(game, game.source || "casino");
  const nameKey = name ? slugifyText(name) : "";
  const providerKey = provider ? slugifyText(provider) : "";
  if (nameKey) return `${nameKey}|${providerKey}`;
  return String(game.id || game.slug || game.gameId || game.code || "");
}

function normaliseGames(games) {
  const seen = new Set();
  return collectCatalogueGames(games)
    .map((game) => {
      if (!game) return null;
      const source = normaliseGameSource(game);
      const name = getGameName(game);
      if (!name) return null;
      const id = game.id || game.slug || game.gameId || game.code || slugifyText(name);
      const route = getGameRoute(game, source);
      return {
        ...game,
        id,
        name,
        image: pickGameImage(game),
        playUrl: new URL(route, "https://beta.lottoland.co.uk").href,
        source,
        provider: getGameProvider(game, source)
      };
    })
    .filter(Boolean)
    .filter((game) => {
      const key = uniqueGameKey(game);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normaliseGameSource(game) {
  const searchable = [
    game.source,
    game.category,
    game.type,
    game.vertical,
    game.product,
    game.playUrl,
    game.url,
    game.href,
    game.launchUrl,
    game.gameUrl,
    game.path
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (searchable.includes("bingo")) return "bingo";
  if (searchable.includes("live")) return "live";
  return "casino";
}

function pickGameImage(game) {
  const candidates = [
    game.image,
    game.imageUrl,
    game.thumbnail,
    game.thumbnailUrl,
    game.logo,
    game.background,
    game.backgroundImage,
    game.coverImage,
    game.poster,
    game.icon,
    game.tileImage,
    game.assets,
    game.images,
    game.media
  ];

  for (const candidate of candidates) {
    const imageUrl = extractGameImageUrl(candidate);
    if (imageUrl) return imageUrl;
  }
  return "";
}

function extractGameImageUrl(candidate) {
  if (!candidate) return "";
  if (typeof candidate === "string") return absoluteGameAssetUrl(candidate);
  if (Array.isArray(candidate)) {
    for (const item of candidate) {
      const imageUrl = extractGameImageUrl(item);
      if (imageUrl) return imageUrl;
    }
    return "";
  }
  if (typeof candidate === "object") {
    const nestedCandidates = [
      candidate.url,
      candidate.src,
      candidate.href,
      candidate.path,
      candidate.image,
      candidate.imageUrl,
      candidate.thumbnail,
      candidate.thumbnailUrl,
      candidate.logo,
      candidate.background,
      candidate.backgroundImage,
      candidate.cover,
      candidate.default,
      candidate.small,
      candidate.medium,
      candidate.large
    ];
    for (const nestedCandidate of nestedCandidates) {
      const imageUrl = extractGameImageUrl(nestedCandidate);
      if (imageUrl) return imageUrl;
    }
  }
  return "";
}

function absoluteGameAssetUrl(value) {
  try {
    return new URL(value, "https://beta.lottoland.co.uk").href;
  } catch (error) {
    return "";
  }
}

function slugifyText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "game";
}

function renderSite() {
  const casinoGames = currentGames.filter((game) => game.source === "casino");
  const liveGames = currentGames.filter((game) => game.source === "live");
  const bingoGames = currentGames.filter((game) => game.source === "bingo");

  renderLobbyGroups(
    "featured",
    buildLobbyGroups(casinoGames.length ? casinoGames : currentGames, {
      leadTitle: siteLanguage === "es" ? "Favoritos destacados" : "Featured favourites",
      analyticsTitle: "Featured favourites",
      source: "casino",
      limit: 4
    })
  );
  renderLobbyGroups(
    "live",
    buildLobbyGroups(liveGames.length ? liveGames : currentGames, {
      leadTitle: siteLanguage === "es" ? "Favoritos en vivo" : "Live favourites",
      analyticsTitle: "Live favourites",
      source: "live",
      limit: 4
    })
  );
  renderLobbyGroups(
    "bingo",
    buildLobbyGroups(bingoGames.length ? bingoGames : currentGames, {
      leadTitle: siteLanguage === "es" ? "Favoritos de bingo" : "Bingo favourites",
      analyticsTitle: "Bingo favourites",
      source: "bingo",
      limit: 4
    })
  );
  renderBuilder();
}

function buildLobbyGroups(games, { leadTitle, analyticsTitle, limit, source }) {
  const imageFirst = uniqueGames(sortImageFirst(games));
  const railSizeBySource = { casino: 18, live: 14, bingo: 6 };
  const groupLimitBySource = { casino: limit, live: limit, bingo: Math.min(limit, 3) };
  const railSize = railSizeBySource[source] || 18;
  const targetGroupCount = groupLimitBySource[source] || limit;
  const usedGames = new Set();
  const groups = [];

  function addGroup(title, groupAnalyticsTitle, candidateGames) {
    if (groups.length >= targetGroupCount) return;
    const selectedGames = takeUnusedGames(candidateGames, usedGames, railSize);
    if (!selectedGames.length) return;
    groups.push({
      title,
      analyticsTitle: groupAnalyticsTitle,
      games: selectedGames
    });
  }

  addGroup(leadTitle, analyticsTitle, imageFirst);

  buildThemeLobbyGroupSpecs(source).forEach(([title, matcher]) => {
    const matched = imageFirst.filter((game) => matcher.test(`${game.name} ${game.provider}`));
    addGroup(title, title, matched.length ? matched : imageFirst);
  });

  groupByProvider(imageFirst).forEach(([provider, providerGames]) => {
    addGroup(provider, provider, providerGames);
  });

  let fallbackIndex = groups.length + 1;
  while (groups.length < targetGroupCount) {
    const beforeCount = groups.length;
    addGroup(`${leadTitle} ${fallbackIndex}`, `${analyticsTitle} ${fallbackIndex}`, imageFirst);
    if (groups.length === beforeCount) break;
    fallbackIndex += 1;
  }

  return uniqueLobbyGroups(groups).filter((group) => group.games.length);
}

function buildThemeLobbyGroupSpecs(source) {
  const groupsBySource = {
    casino: [
      ["Big win picks", /big|bass|gates|777|strike|book|gold|fish|catch|jackpot/i],
      ["New casino games", /aliens|double|shark|luxor|crabby|railroad|piggy|brawl/i],
      ["Slot favourites", /./]
    ],
    live: [
      ["Table classics", /blackjack|baccarat|hold.?em|dragon/i],
      ["Roulette and game shows", /roulette|dream|crazy|monopoly|mega|game show/i],
      ["Live dealer favourites", /./]
    ],
    bingo: [
      ["Top bingo rooms", /./],
      ["Bingo bonuses", /bonus|boost|drop|cash|powerful|diamond|sparkle/i],
      ["Open rooms", /bingo|room|club|night|party/i]
    ]
  };

  return groupsBySource[source] || [];
}

function takeUnusedGames(games, usedGames, limit) {
  const selectedGames = [];
  const selectedKeys = new Set();
  uniqueGames(sortImageFirst(games)).forEach((game) => {
    if (selectedGames.length >= limit) return;
    const keys = lobbyGameDedupeKeys(game);
    if (!keys.length || keys.some((key) => usedGames.has(key) || selectedKeys.has(key))) return;
    keys.forEach((key) => {
      usedGames.add(key);
      selectedKeys.add(key);
    });
    selectedGames.push(game);
  });
  return selectedGames;
}

function lobbyGameDedupeKeys(game) {
  const keys = [];
  const idKey = uniqueGameKey(game);
  if (idKey) keys.push(idKey);

  const source = String(game.source || normaliseGameSource(game) || "game").trim().toLowerCase();
  const provider = String(game.provider || "").trim().toLowerCase();
  const name = String(game.name || game.title || "").trim().toLowerCase();
  if (name) keys.push(`${source}:${provider}:${name}`);

  return keys;
}

function groupByProvider(games) {
  const grouped = new Map();
  games.forEach((game) => {
    const provider = game.provider || "More games";
    if (!grouped.has(provider)) grouped.set(provider, []);
    grouped.get(provider).push(game);
  });
  return [...grouped.entries()]
    .filter(([, providerGames]) => providerGames.length >= 3)
    .sort((first, second) => second[1].length - first[1].length);
}

function sortImageFirst(games) {
  return games
    .filter((game) => game.image)
    .concat(games.filter((game) => !game.image));
}

function uniqueGames(games) {
  const seen = new Set();
  return games.filter((game) => {
    const key = uniqueGameKey(game);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniqueLobbyGroups(groups) {
  const seen = new Set();
  return groups.filter((group) => {
    const key = group.title.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderLobbyGroups(name, groups) {
  const container = document.querySelector(`[data-grid="${name}"]`);
  if (!container) return;
  container.replaceChildren(
    ...groups.map((group, index) => createLobbyGroup(name, group, index))
  );
}

function createLobbyGroup(name, group, index) {
  const section = document.createElement("section");
  const railGames = uniqueGames(group.games);
  section.className = "lobby-group";
  section.dataset.lobbyGroup = `${name}-${index}`;
  section.dataset.analyticsName = group.analyticsTitle || group.title;
  section.innerHTML = `
    <header>
      <h3>${escapeHtml(group.title)}</h3>
      <button type="button" data-view-toggle="${escapeHtml(section.dataset.lobbyGroup)}" aria-pressed="false">${escapeHtml(t("viewAll"))}</button>
    </header>
    <div class="game-rail lobby-rail"></div>
  `;
  section
    .querySelector(".lobby-rail")
    .replaceChildren(
      ...railGames.map((game, position) =>
        createGameCard(game, { sectionName: group.analyticsTitle || group.title, position })
      )
    );
  return section;
}

function createGameCard(game, context = {}) {
  const card = cardTemplate.content.firstElementChild.cloneNode(true);
  const image = card.querySelector("img");
  const badge = card.querySelector(".game-badge");
  const title = card.querySelector("strong");
  const provider = card.querySelector("small");

  card.dataset.gameId = game.id;
  card.dataset.source = game.source;
  card.dataset.gameName = game.name;
  card.dataset.gameProvider = game.provider;
  card.dataset.sectionName = context.sectionName || "";
  card.dataset.position = String(context.position ?? "");
  card.dataset.playUrl = game.playUrl;
  card.setAttribute("role", "button");
  card.tabIndex = 0;
  card.setAttribute("aria-label", `${game.name} by ${game.provider}`);
  card.classList.add(`is-${game.source}`);
  card.classList.toggle("is-in-my-casino", isGameInMyCasino(game.id));
  badge.textContent = displaySourceLabel(game.source);
  title.textContent = game.name;
  provider.textContent = game.provider;

  if (game.image) {
    image.src = game.image;
    image.alt = "";
    image.onerror = () => {
      console.warn("Official game image failed to load:", {
        game: game.name,
        provider: game.provider,
        image: game.image
      });
      image.remove();
      card.style.background = placeholderBackground(game.source);
    };
  } else {
    image.remove();
    card.style.background = placeholderBackground(game.source);
  }

  trackGameViewed(game, context);
  return card;
}

function trackGameViewed(game, context = {}) {
  const impressionKey = [
    context.sectionName || "unknown-section",
    game.id,
    context.position ?? "unknown-position"
  ].join(":");

  if (viewedGameImpressionKeys.has(impressionKey)) return;

  viewedGameImpressionKeys.add(impressionKey);
  trackUxEvent("Game Viewed", gameAnalyticsProperties(game, context));
}

function handleLobbyViewToggle(event) {
  const button = event.target.closest("[data-view-toggle]");
  if (!button) return;

  const group = document.querySelector(
    `[data-lobby-group="${CSS.escape(button.dataset.viewToggle)}"]`
  );
  const rail = group?.querySelector(".lobby-rail");
  if (!group || !rail) return;

  const expanded = group.classList.toggle("is-expanded");
  button.textContent = expanded ? t("carousel") : t("viewAll");
  button.setAttribute("aria-pressed", String(expanded));
  trackCarouselUsed({
    carouselName: group.dataset.analyticsName || button.dataset.viewToggle,
    action: expanded ? "expanded" : "collapsed",
    carouselId: button.dataset.viewToggle
  });
  rail.scrollLeft = 0;
}

function handleRegistrationClick(event) {
  const depositLimit = event.target.closest("[data-deposit-limit]");
  if (depositLimit) {
    trackUxEvent("Deposit Limit Selected", {
      component: "Deposit limits",
      amount: depositLimit.dataset.depositLimit
    });
    event.target.closest(".deposit-limit-component")
      ?.querySelectorAll("[data-deposit-limit]")
      .forEach((button) => button.classList.toggle("is-selected", button === depositLimit));
    const customField = event.target
      .closest(".deposit-limit-component")
      ?.querySelector("[data-deposit-limit-custom]");
    if (customField) {
      customField.hidden = depositLimit.dataset.depositLimit !== "Custom";
      if (!customField.hidden) customField.querySelector("input")?.focus();
    }
    return;
  }

  if (event.target.closest("[data-deposit-limit-save]")) {
    const component = event.target.closest(".deposit-limit-component");
    const selected = component
      ?.querySelector("[data-deposit-limit].is-selected")
      ?.dataset.depositLimit;
    const customAmount = component?.querySelector("[data-deposit-limit-custom] input")?.value.trim();
    trackUxEvent("Deposit Limit Saved", {
      component: "Deposit limits",
      amount: selected === "Custom" && customAmount ? `Custom ${customAmount}` : selected || "not selected"
    });
    event.target.textContent = "Limit saved";
    return;
  }

  const opener = event.target.closest("[data-register-open]");
  if (opener) {
    const offerId = opener.dataset.offerCta || activeOfferId || "";
    pendingRegistrationOfferId = offerId;
    registerVariant = registerVariant === "single" ? "stepped" : "single";
    registerStep = 0;
    storageSet({
      impossibleRegisterVariant: registerVariant
    });
    openRegistrationModal();
    if (offerId) {
      trackOfferExperimentEvent("Offer CTA Clicked", offerId, {
        ctaLabel: "Join Now"
      });
    }
    trackRegistrationProgress("Registration Started", {
      variant: registerVariant,
      stepIndex: registerVariant === "stepped" ? 0 : null,
      stepName: registerVariant === "stepped" ? registrationSteps[0].title : "All fields",
      offerId: offerId || undefined,
      offerLabel: offerId ? offerLabel(offerId) : undefined
    });
    return;
  }

  if (event.target.closest("[data-register-close]")) {
    closeRegistrationModal();
    return;
  }

  const stepButton = event.target.closest("[data-register-step]");
  if (stepButton) {
    const direction = stepButton.dataset.registerStep;
    if (direction === "next") {
      registerStep = Math.min(registerStep + 1, registrationSteps.length - 1);
    } else if (direction === "back") {
      registerStep = Math.max(registerStep - 1, 0);
    }
    trackRegistrationProgress("Registration Step Viewed", {
      variant: registerVariant,
      direction,
      stepIndex: registerStep,
      stepName: registrationSteps[registerStep]?.title
    });
    renderRegistration();
    return;
  }

  if (event.target.closest("[data-register-complete]")) {
    trackRegistrationProgress("Registration Completed", {
      variant: registerVariant,
      stepIndex: registerVariant === "stepped" ? registerStep : null,
      stepName: registerVariant === "stepped" ? registrationSteps[registerStep]?.title : "All fields",
      offerId: pendingRegistrationOfferId || undefined,
      offerLabel: pendingRegistrationOfferId ? offerLabel(pendingRegistrationOfferId) : undefined
    });
    if (pendingRegistrationOfferId) {
      trackOfferExperimentEvent("Offer Registration Completed", pendingRegistrationOfferId);
      pendingRegistrationOfferId = "";
    }
    renderRegistrationComplete();
  }
}

function handleRegistrationKeydown(event) {
  if (event.key !== "Escape") return;
  if (loginModal && !loginModal.hidden) {
    closeLoginModal();
    return;
  }
  if (registerModal && !registerModal.hidden) {
    closeRegistrationModal();
  }
}

function openRegistrationModal() {
  if (!registerModal) return;
  registerModal.hidden = false;
  document.body.classList.add("has-modal");
  renderRegistration();
  requestAnimationFrame(() =>
    registerModal.querySelector("input, select, button")?.focus()
  );
}

function closeRegistrationModal() {
  if (!registerModal) return;
  registerModal.hidden = true;
  if (!loginModal || loginModal.hidden) {
    document.body.classList.remove("has-modal");
  }
}

function renderRegistration() {
  if (!registerForm) return;

  if (registerVariant === "stepped") {
    renderSteppedRegistration();
  } else {
    renderSingleRegistration();
  }
  applyBrandContent();
}

function renderSingleRegistration() {
  registerForm.className = "register-form is-single";
  registerForm.setAttribute("autocomplete", "off");
  registerForm.innerHTML = `
    <div class="register-form-heading">
      <span>${escapeHtml(t("createAccountShort"))}</span>
      <h3>${escapeHtml(t("tellUsAboutYou"))}</h3>
      <p>${escapeHtml(t("compactRegistration"))}</p>
    </div>
    <div class="register-field-grid">
      ${registrationSteps
        .flatMap((step) => step.fields)
        .map(fieldMarkup)
        .join("")}
    </div>
    <div class="register-actions">
      <button class="button button-yellow" type="button" data-register-complete>${escapeHtml(t("completeConcept"))}</button>
    </div>
  `;
}

function renderSteppedRegistration() {
  const step = registrationSteps[registerStep];
  registerForm.className = "register-form is-stepped";
  registerForm.setAttribute("autocomplete", "off");
  registerForm.innerHTML = `
    <div class="register-progress">
      ${registrationSteps
        .map(
          (_, index) =>
            `<span class="${index <= registerStep ? "is-complete" : ""}"></span>`
        )
        .join("")}
    </div>
    <div class="register-form-heading">
      <span>${escapeHtml(t("stepOf", { current: registerStep + 1, total: registrationSteps.length }))}</span>
      <h3>${escapeHtml(registrationStepTitle(registerStep))}</h3>
      <p>${escapeHtml(registrationStepHelper(registerStep))}</p>
    </div>
    <div class="register-field-grid">
      ${step.fields.map(fieldMarkup).join("")}
    </div>
    <div class="register-actions">
      <button class="button button-ghost button-save" type="button" data-register-step="back" ${registerStep === 0 ? "disabled" : ""}>${escapeHtml(t("back"))}</button>
      ${
        registerStep === registrationSteps.length - 1
          ? `<button class="button button-yellow" type="button" data-register-complete>${escapeHtml(t("completeConcept"))}</button>`
          : `<button class="button button-pink" type="button" data-register-step="next">${escapeHtml(t("continue"))}</button>`
      }
    </div>
  `;
}

function renderRegistrationComplete() {
  const depositLimits = readWidgetState().featureSwitches?.depositLimits || defaultWidgetState().featureSwitches.depositLimits;
  const showDepositLimits = depositLimits.enabled && depositLimits.market !== "off";
  registerForm.className = "register-form is-complete";
  registerForm.innerHTML = `
    <div class="register-success">
      <span>✓</span>
      <h3>${escapeHtml(t("conceptComplete"))}</h3>
      <p>${escapeHtml(t("noDataSubmitted"))}</p>
      ${
        showDepositLimits
          ? depositLimitComponentMarkup(depositLimits)
          : ""
      }
      <button class="button button-pink" type="button" data-register-close>${escapeHtml(t("close"))}</button>
    </div>
  `;
  if (showDepositLimits) {
    trackUxEvent("Feature Switch Component Displayed", {
      component: "Deposit limits",
      market: depositLimits.market,
      period: depositLimits.period,
      placement: "post-registration"
    });
  }
}

function renderLottery() {
  if (!lotteryTicketsNode || !lotterySummaryNode) return;
  lotteryTicketsNode.replaceChildren(
    ...lotteryState.tickets.map((ticket, index) => createLotteryTicket(ticket, index))
  );
  document.querySelectorAll("[data-lottery-day]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lotteryDay === lotteryState.days);
  });
  document.querySelectorAll("[data-lottery-weeks]").forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.lotteryWeeks) === lotteryState.weeks);
  });
  const renew = document.querySelector("[data-lottery-renew]");
  if (renew) renew.checked = lotteryState.renew;
  renderLotterySummary();
}

function createLotteryTicket(ticket, index) {
  const card = document.createElement("article");
  card.className = "lottery-ticket";
  card.innerHTML = `
    <header>
      <button type="button" aria-label="${escapeHtml(t("clearLine", { number: index + 1 }))}" data-lottery-clear="${index}">×</button>
      <strong>${escapeHtml(t("ticketStatus", { numbers: ticket.numbers.length, stars: ticket.stars.length }))}</strong>
      <button type="button" aria-label="${escapeHtml(t("randomLine", { number: index + 1 }))}" data-lottery-random="${index}">⚂</button>
    </header>
    <div class="lottery-number-grid">
      ${Array.from({ length: 50 }, (_, numberIndex) =>
        lotteryBallMarkup(index, numberIndex + 1, "number", ticket.numbers)
      ).join("")}
    </div>
    <p>${escapeHtml(t("stars"))}</p>
    <div class="lottery-star-grid">
      ${Array.from({ length: 12 }, (_, starIndex) =>
        lotteryBallMarkup(index, starIndex + 1, "star", ticket.stars)
      ).join("")}
    </div>
  `;
  return card;
}

function lotteryBallMarkup(ticketIndex, value, type, selected) {
  const active = selected.includes(value) ? " is-selected" : "";
  return `<button class="lottery-ball${active}" type="button" data-lottery-pick="${ticketIndex}" data-lottery-type="${type}" data-lottery-value="${value}">${value}</button>`;
}

function renderLotterySummary() {
  const completeLines = lotteryState.tickets.filter(isCompleteTicket).length;
  const drawCount = lotteryState.days === "all" ? 2 : 1;
  const total = completeLines * drawCount * lotteryState.weeks * 2.5;
  const dayLabel =
    lotteryState.days === "all"
      ? t("tuesdayFriday")
      : lotteryState.days === "tue"
        ? t("tuesday")
        : t("friday");

  lotterySummaryNode.innerHTML = `
    <h3>${escapeHtml(t("yourTicket"))}</h3>
    <div class="lottery-warning ${completeLines ? "is-ok" : ""}">
      ${escapeHtml(completeLines ? t("checkoutReady") : t("fillLine"))}
    </div>
    <dl>
      <div><dt>${escapeHtml(t("drawDays"))}</dt><dd>${escapeHtml(dayLabel)}</dd></div>
      <div><dt>${escapeHtml(t("weeks"))}</dt><dd>${lotteryState.weeks}</dd></div>
      <div><dt>${escapeHtml(t("completeLines"))}</dt><dd>${completeLines}</dd></div>
      <div><dt>${escapeHtml(t("autoRenew"))}</dt><dd>${escapeHtml(lotteryState.renew ? t("on") : t("off"))}</dd></div>
      <div><dt>${escapeHtml(t("total"))}</dt><dd>£${total.toFixed(2)}</dd></div>
    </dl>
    <button class="lottery-checkout" type="button" data-lottery-action="checkout" ${completeLines ? "" : "disabled"}>
      ${escapeHtml(lotteryState.checkedOut ? t("checkoutReadyButton") : t("goCheckout"))}
    </button>
  `;
}

function handleLotteryClick(event) {
  const pick = event.target.closest("[data-lottery-pick]");
  if (pick) {
    toggleLotteryPick(
      Number(pick.dataset.lotteryPick),
      pick.dataset.lotteryType,
      Number(pick.dataset.lotteryValue)
    );
    return;
  }

  const random = event.target.closest("[data-lottery-random]");
  if (random) {
    const ticketIndex = Number(random.dataset.lotteryRandom);
    fillLotteryTicket(ticketIndex);
    trackUxEvent("Lottery Dice Used", {
      ticketIndex,
      completeLines: lotteryState.tickets.filter(isCompleteTicket).length
    });
    renderLottery();
    return;
  }

  const clear = event.target.closest("[data-lottery-clear]");
  if (clear) {
    lotteryState.tickets[Number(clear.dataset.lotteryClear)] = { numbers: [], stars: [] };
    lotteryState.checkedOut = false;
    renderLottery();
    return;
  }

  const quick = event.target.closest("[data-lottery-quick]");
  if (quick) {
    quickPickLottery(quick.dataset.lotteryQuick);
    trackUxEvent("Lottery Quick Pick Used", {
      amount: quick.dataset.lotteryQuick,
      completeLines: lotteryState.tickets.filter(isCompleteTicket).length
    });
    return;
  }

  const day = event.target.closest("[data-lottery-day]");
  if (day) {
    lotteryState.days = day.dataset.lotteryDay;
    lotteryState.checkedOut = false;
    trackUxEvent("Lottery Day Selected", {
      days: lotteryState.days
    });
    renderLottery();
    return;
  }

  const weeks = event.target.closest("[data-lottery-weeks]");
  if (weeks) {
    lotteryState.weeks = Number(weeks.dataset.lotteryWeeks);
    lotteryState.checkedOut = false;
    trackUxEvent("Lottery Duration Selected", {
      weeks: lotteryState.weeks
    });
    renderLottery();
    return;
  }

  const action = event.target.closest("[data-lottery-action]");
  if (!action) return;
  if (action.dataset.lotteryAction === "clear-all") {
    lotteryState.tickets = lotteryState.tickets.map(() => ({ numbers: [], stars: [] }));
    lotteryState.checkedOut = false;
    renderLottery();
  } else if (action.dataset.lotteryAction === "checkout") {
    lotteryState.checkedOut = true;
    trackUxEvent("Layout Saved", {
      journey: "lottery-checkout",
      completeLines: lotteryState.tickets.filter(isCompleteTicket).length,
      days: lotteryState.days,
      weeks: lotteryState.weeks,
      renew: lotteryState.renew
    });
    renderLotterySummary();
  }
}

function handleLotteryChange(event) {
  if (!event.target.matches("[data-lottery-renew]")) return;
  lotteryState.renew = event.target.checked;
  lotteryState.checkedOut = false;
  trackUxEvent("Lottery Auto Renew Changed", {
    renew: lotteryState.renew
  });
  renderLotterySummary();
}

function toggleLotteryPick(ticketIndex, type, value) {
  const ticket = lotteryState.tickets[ticketIndex];
  if (!ticket) return;
  const key = type === "star" ? "stars" : "numbers";
  const limit = type === "star" ? 2 : 5;
  if (ticket[key].includes(value)) {
    ticket[key] = ticket[key].filter((item) => item !== value);
  } else if (ticket[key].length < limit) {
    ticket[key] = [...ticket[key], value].sort((a, b) => a - b);
  }
  lotteryState.checkedOut = false;
  trackUxEvent("Lottery Number Selected", {
    ticketIndex,
    pickType: type,
    completeLines: lotteryState.tickets.filter(isCompleteTicket).length
  });
  renderLottery();
}

function quickPickLottery(amount) {
  const count = amount === "all" ? lotteryState.tickets.length : Number(amount);
  lotteryState.tickets = lotteryState.tickets.map((ticket, index) =>
    index < count ? randomLotteryTicket() : ticket
  );
  lotteryState.checkedOut = false;
  renderLottery();
}

function fillLotteryTicket(index) {
  lotteryState.tickets[index] = randomLotteryTicket();
  lotteryState.checkedOut = false;
}

function randomLotteryTicket() {
  return {
    numbers: randomUniqueNumbers(5, 50),
    stars: randomUniqueNumbers(2, 12)
  };
}

function randomUniqueNumbers(count, max) {
  const values = [];
  while (values.length < count) {
    const value = Math.floor(Math.random() * max) + 1;
    if (!values.includes(value)) values.push(value);
  }
  return values.sort((a, b) => a - b);
}

function isCompleteTicket(ticket) {
  return ticket.numbers.length === 5 && ticket.stars.length === 2;
}

function registrationFieldLabel(field) {
  const labels = {
    email: "emailAddress",
    password: "password",
    firstName: "firstName",
    lastName: "lastName",
    dateOfBirth: "dateOfBirth",
    phone: "mobileNumber",
    postcode: "postcode",
    address1: "addressLine1",
    city: "townOrCity",
    playStyle: "favouritePlayStyle",
    marketing: "marketing",
    ageConfirm: "ageConfirm",
    terms: "termsAccept"
  };
  return labels[field.id] ? t(labels[field.id]) : field.label;
}

function registrationFieldPlaceholder(field) {
  if (field.id === "email") return t("emailAddress");
  if (field.id === "password") return t("createPassword");
  if (field.id === "postcode") return t("postcode");
  if (field.id === "address1") return siteLanguage === "es" ? "Casa y calle" : "House and street";
  if (field.id === "city") return t("townOrCity");
  return registrationFieldLabel(field);
}

function registrationOptionLabel(option) {
  const labels = {
    "Slots and jackpots": "slotsAndJackpots",
    "Live casino": "sourceLive",
    "Bingo rooms": "bingoRooms",
    "Lottery draws": "lotteryDraws"
  };
  return labels[option] ? t(labels[option]) : option;
}

function registrationStepTitle(index) {
  return [
    t("accountStep"),
    t("personalStep"),
    t("addressStep"),
    t("preferencesStep")
  ][index] || registrationSteps[index]?.title || "";
}

function registrationStepHelper(index) {
  return [
    t("accountHelper"),
    t("personalHelper"),
    t("addressHelper"),
    t("preferencesHelper")
  ][index] || registrationSteps[index]?.helper || "";
}

function fieldMarkup(field) {
  const demoSafeName = `demo-${field.id}`;
  const label = registrationFieldLabel(field);
  if (field.type === "checkbox") {
    return `
      <label class="register-check">
        <input type="checkbox" name="${escapeHtml(demoSafeName)}" autocomplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true">
        <span>${escapeHtml(label)}</span>
      </label>
    `;
  }

  if (field.type === "select") {
    return `
      <label>
        <span>${escapeHtml(label)}</span>
        <select name="${escapeHtml(demoSafeName)}" autocomplete="off" data-form-type="other" data-lpignore="true" data-1p-ignore="true">
          ${field.options
            .map((option) => `<option>${escapeHtml(registrationOptionLabel(option))}</option>`)
            .join("")}
        </select>
      </label>
    `;
  }

  return `
    <label>
      <span>${escapeHtml(label)}</span>
      <input
        type="${escapeHtml(field.type)}"
        name="${escapeHtml(demoSafeName)}"
        placeholder="${escapeHtml(field.placeholder ? registrationFieldPlaceholder(field) : "")}"
        autocomplete="off"
        ${field.inputmode ? `inputmode="${escapeHtml(field.inputmode)}"` : ""}
        autocapitalize="none"
        spellcheck="false"
        data-form-type="other"
        data-lpignore="true"
        data-1p-ignore="true">
    </label>
  `;
}

function renderBuilder() {
  renderBuilderChrome();
  if (!builderState.editMode) {
    renderSavedLobby();
    return;
  }
  renderProviderOptions();
  renderLibrary();
  renderCarousels();
}

function renderBuilderChrome() {
  const lobbyTitle = builderState.title || "My Casino";
  if (lobbyTitleDisplay) {
    lobbyTitleDisplay.textContent = lobbyTitle;
    lobbyTitleDisplay.hidden = builderState.editMode;
  }
  if (lobbyTitleInput) {
    lobbyTitleInput.hidden = !builderState.editMode;
    lobbyTitleInput.value = lobbyTitle;
  }
  if (myCasinoNavLink) {
    myCasinoNavLink.textContent = lobbyTitle;
  }

  if (builderActions) {
    builderActions.innerHTML = builderState.editMode
      ? `
        <button class="button button-ghost button-save" type="button" data-builder-action="save-lobby">${escapeHtml(t("saveLobby"))}</button>
        <button class="button button-yellow" type="button" data-builder-action="add-carousel">${escapeHtml(t("addCarousel"))}</button>
      `
      : `<button class="button button-pink" type="button" data-builder-action="edit-lobby">${escapeHtml(t("editLobby"))}</button>`;
  }

  if (builderIntro) {
    builderIntro.hidden = !builderState.editMode;
  }
  if (gameLibrary) {
    gameLibrary.hidden = !builderState.editMode;
  }
  if (builderWorkspace) {
    builderWorkspace.classList.toggle("is-saved", !builderState.editMode);
  }
}

function renderProviderOptions() {
  if (!providerSelect) return;
  const providers = uniqueSorted(
    currentGames
      .filter(
        (game) =>
          builderState.source === "all" || game.source === builderState.source
      )
      .map((game) => game.provider)
  );
  providerSelect.replaceChildren(new Option(t("allProviders"), ""));
  providers.forEach((provider) => {
    providerSelect.append(new Option(provider, provider));
  });
  providerSelect.value = providers.includes(builderState.provider)
    ? builderState.provider
    : "";
  builderState.provider = providerSelect.value;

  const searchInput = document.querySelector('[data-builder-field="search"]');
  const sourceSelect = document.querySelector('[data-builder-field="source"]');
  if (searchInput) searchInput.value = builderState.search;
  if (sourceSelect) sourceSelect.value = builderState.source;
}

function renderLibrary() {
  if (!libraryList) return;
  const games = filteredLibraryGames();
  libraryList.replaceChildren(...games.map(createLibraryCard));
  if (libraryCount) libraryCount.textContent = gameCountLabel(games.length);
  if (builderState.search.trim() && !games.length) {
    trackUxEvent("Search No Results", {
      searchTerm: builderState.search.trim(),
      source: builderState.source,
      provider: builderState.provider
    });
  }
}

function filteredLibraryGames() {
  const term = builderState.search.trim().toLowerCase();
  return currentGames
    .filter((game) => {
      const matchesSource =
        builderState.source === "all" || game.source === builderState.source;
      const matchesProvider =
        !builderState.provider || game.provider === builderState.provider;
      const text = `${game.name} ${game.provider} ${displaySourceLabel(game.source)}`.toLowerCase();
      return matchesSource && matchesProvider && (!term || text.includes(term));
    })
    .sort((first, second) => {
      const byName = first.name.localeCompare(second.name, undefined, {
        numeric: true,
        sensitivity: "base"
      });
      if (byName) return byName;
      return first.provider.localeCompare(second.provider, undefined, {
        numeric: true,
        sensitivity: "base"
      });
    });
}

function createLibraryCard(game) {
  const card = libraryCardTemplate.content.firstElementChild.cloneNode(true);
  const image = card.querySelector("img");
  const title = card.querySelector("strong");
  const provider = card.querySelector("small");

  card.dataset.gameId = game.id;
  card.classList.toggle("is-in-my-casino", isGameInMyCasino(game.id));
  title.textContent = game.name;
  provider.textContent = `${game.provider} · ${displaySourceLabel(game.source)}`;

  if (isGameInMyCasino(game.id)) {
    const favourite = document.createElement("span");
    favourite.className = "game-favourite-indicator";
    favourite.setAttribute("aria-label", "Added to My Casino");
    favourite.textContent = "♥";
    card.append(favourite);
  }

  if (game.image) {
    image.src = game.image;
    image.alt = "";
  } else {
    image.remove();
  }

  return card;
}

function renderCarousels() {
  if (!carouselBuilder) return;

  if (!builderState.carousels.length) {
    carouselBuilder.replaceChildren(createEmptyBuilder());
    return;
  }

  carouselBuilder.replaceChildren(
    ...builderState.carousels.map((carousel, index) =>
      createCarouselElement(carousel, index)
    )
  );
}

function renderSavedLobby() {
  if (!carouselBuilder) return;

  const populatedCarousels = builderState.carousels.filter((carousel) =>
    carousel.gameIds.some((id) => currentGames.some((game) => game.id === id))
  );

  if (!populatedCarousels.length) {
    carouselBuilder.replaceChildren(createSavedEmptyLobby());
    return;
  }

  carouselBuilder.replaceChildren(
    ...populatedCarousels.map(createSavedCarouselElement)
  );
}

function createSavedEmptyLobby() {
  const empty = document.createElement("section");
  empty.className = "empty-state builder-empty";
  empty.innerHTML = `
    <h3>${escapeHtml(t("emptyLobbyTitle"))}</h3>
    <p>${escapeHtml(t("emptyLobbyCopy"))}</p>
  `;
  return empty;
}

function createSavedCarouselElement(carousel, index) {
  const section = document.createElement("section");
  section.className = "saved-carousel lobby-group";
  section.dataset.lobbyGroup = `my-casino-${index}`;

  const games = carousel.gameIds
    .map((id) => currentGames.find((game) => game.id === id))
    .filter(Boolean);

  section.innerHTML = `
    <header>
      <h3>${escapeHtml(carousel.title)}</h3>
      <button type="button" data-view-toggle="${escapeHtml(section.dataset.lobbyGroup)}" aria-pressed="false">${escapeHtml(t("viewAll"))}</button>
    </header>
    <div class="game-rail lobby-rail saved-game-rail"></div>
  `;
  section
    .querySelector(".saved-game-rail")
    .replaceChildren(
      ...games.map((game, position) =>
        createGameCard(game, { sectionName: carousel.title, position })
      )
    );
  return section;
}

function createEmptyBuilder() {
  const empty = document.createElement("section");
  empty.className = "empty-state builder-empty";
  empty.innerHTML = `
    <h3>${escapeHtml(t("firstCarouselTitle"))}</h3>
    <p>${escapeHtml(t("firstCarouselCopy"))}</p>
    <button class="button button-yellow" type="button" data-builder-action="add-carousel">${escapeHtml(t("addCarousel"))}</button>
  `;
  return empty;
}

function createCarouselElement(carousel, index) {
  const section = document.createElement("section");
  section.className = "builder-carousel";
  section.dataset.carouselId = carousel.id;
  section.dataset.dropCarouselId = carousel.id;
  if (carousel.id === builderState.selectedCarouselId) {
    section.classList.add("is-selected");
  }

  const games = carousel.gameIds
    .map((id) => currentGames.find((game) => game.id === id))
    .filter(Boolean);

  section.innerHTML = `
    <header draggable="true" data-carousel-drag-id="${escapeHtml(carousel.id)}">
      <span class="drag-handle carousel-drag-handle" aria-hidden="true"></span>
      <input data-builder-field="carousel-title" data-carousel-id="${escapeHtml(carousel.id)}" value="${escapeHtml(carousel.title)}" aria-label="Carousel title">
      <span>${escapeHtml(gameCountLabel(games.length))}</span>
      <button class="icon-button icon-button-trash" type="button" data-builder-action="delete-carousel" data-carousel-id="${escapeHtml(carousel.id)}" aria-label="${escapeHtml(t("delete"))}">
        <span class="trash-icon" aria-hidden="true"></span>
      </button>
    </header>
    <div class="builder-track ${games.length ? "" : "is-empty"}" data-drop-carousel-id="${escapeHtml(carousel.id)}"></div>
  `;

  const track = section.querySelector(".builder-track");
  if (!games.length) {
    track.textContent = t("dropGames");
    return section;
  }

  track.replaceChildren(
    ...games.map((game, gameIndex) =>
      createBuilderGameCard(game, carousel.id, gameIndex)
    )
  );
  return section;
}

function createBuilderGameCard(game, carouselId, index) {
  const card = document.createElement("article");
  card.className = "builder-game-card";
  card.draggable = true;
  card.dataset.gameId = game.id;
  card.dataset.carouselId = carouselId;
  card.dataset.gameIndex = String(index);

  const imageMarkup = game.image
    ? `<img src="${escapeHtml(game.image)}" alt="">`
    : "";
  card.innerHTML = `
    <div class="builder-game-image">${imageMarkup}</div>
    <strong>${escapeHtml(game.name)}</strong>
    <small>${escapeHtml(game.provider)}</small>
    <div class="builder-game-actions">
      <span class="drag-handle builder-drag-hint" aria-hidden="true"></span>
      <button class="icon-button icon-button-trash" type="button" data-builder-action="remove-game" data-carousel-id="${escapeHtml(carouselId)}" data-game-id="${escapeHtml(game.id)}" aria-label="${escapeHtml(t("remove"))}">
        <span class="trash-icon" aria-hidden="true"></span>
      </button>
    </div>
  `;
  return card;
}

function handleBuilderClick(event) {
  const target = event.target.closest("[data-builder-action]");
  if (!target) {
    const carousel = event.target.closest(".builder-carousel[data-carousel-id]");
    if (
      carousel &&
      !event.target.closest("button, input, select, textarea, .builder-game-card")
    ) {
      builderState.selectedCarouselId = carousel.dataset.carouselId;
      saveBuilderState();
      renderSite();
    }
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  const action = target.dataset.builderAction;
  const carouselId = target.dataset.carouselId;
  const gameId = target.dataset.gameId;
  let shouldRenderSite = false;

  if (action === "add-carousel") {
    addCarousel();
  } else if (action === "save-lobby") {
    builderState.editMode = false;
    shouldRenderSite = true;
    trackUxEvent("Layout Saved", {
      carouselCount: builderState.carousels.length,
      gameCount: builderState.carousels.reduce((count, carousel) => count + carousel.gameIds.length, 0)
    });
  } else if (action === "edit-lobby") {
    builderState.editMode = true;
    shouldRenderSite = true;
    trackUxEvent("Layout Previewed", {
      carouselCount: builderState.carousels.length
    });
  } else if (action === "select-carousel") {
    builderState.selectedCarouselId = carouselId;
    const carousel = getCarousel(carouselId);
    trackCarouselUsed({
      carouselId,
      carouselName: carousel?.title || carouselId,
      action: "selected"
    });
  } else if (action === "delete-carousel") {
    deleteCarousel(carouselId);
  } else if (action === "add-game") {
    addGameToSelectedCarousel(gameId);
    const carousel = getCarousel(builderState.selectedCarouselId);
    trackCarouselUsed({
      carouselId: carousel?.id,
      carouselName: carousel?.title,
      action: "game-added"
    });
  } else if (action === "remove-game") {
    removeGame(carouselId, gameId);
  } else {
    return;
  }

  saveBuilderState();
  if (shouldRenderSite) {
    renderSite();
  } else {
    renderBuilder();
  }
}

function handleBuilderInput(event) {
  if (event.target.dataset.builderField === "search") {
    builderState.search = event.target.value;
    trackUxEvent("Search Used", {
      searchTerm: builderState.search,
      source: builderState.source,
      provider: builderState.provider
    });
    renderLibrary();
    saveBuilderState();
    return;
  }

  if (event.target.dataset.builderField === "carousel-title") {
    const carousel = getCarousel(event.target.dataset.carouselId);
    if (!carousel) return;
    carousel.title = event.target.value;
    saveBuilderState();
    return;
  }

  if (event.target.dataset.builderField === "lobby-title") {
    builderState.title = event.target.value || "My Casino";
    if (lobbyTitleDisplay) lobbyTitleDisplay.textContent = builderState.title;
    if (myCasinoNavLink) myCasinoNavLink.textContent = builderState.title;
    saveBuilderState();
  }
}

function handleBuilderChange(event) {
  if (event.target.dataset.builderField === "source") {
    builderState.source = event.target.value;
    builderState.provider = "";
    trackUxEvent("Filter Applied", {
      source: builderState.source,
      provider: builderState.provider
    });
    renderBuilder();
    saveBuilderState();
    return;
  }

  if (event.target.dataset.builderField === "provider") {
    builderState.provider = event.target.value;
    trackUxEvent("Filter Applied", {
      source: builderState.source,
      provider: builderState.provider
    });
    renderLibrary();
    saveBuilderState();
  }
}

function addCarousel() {
  const carousel = {
    id: createId(),
    title: `Impossible Picks ${builderState.carousels.length + 1}`,
    gameIds: []
  };
  builderState.carousels.push(carousel);
  builderState.selectedCarouselId = carousel.id;
}

function deleteCarousel(carouselId) {
  builderState.carousels = builderState.carousels.filter(
    (carousel) => carousel.id !== carouselId
  );
  if (builderState.selectedCarouselId === carouselId) {
    builderState.selectedCarouselId = builderState.carousels[0]?.id || "";
  }
}

function reorderCarousel(sourceId, targetId) {
  if (!sourceId || !targetId || sourceId === targetId) return;
  const sourceIndex = builderState.carousels.findIndex(
    (carousel) => carousel.id === sourceId
  );
  const targetIndex = builderState.carousels.findIndex(
    (carousel) => carousel.id === targetId
  );
  if (sourceIndex < 0 || targetIndex < 0) return;

  const [carousel] = builderState.carousels.splice(sourceIndex, 1);
  builderState.carousels.splice(targetIndex, 0, carousel);
  builderState.selectedCarouselId = carousel.id;
}

function addGameToSelectedCarousel(gameId, carouselId = builderState.selectedCarouselId) {
  if (!gameId) return;
  if (!carouselId && !builderState.carousels.length) addCarousel();
  const target = getCarousel(carouselId || builderState.selectedCarouselId);
  if (!target || target.gameIds.includes(gameId)) return;
  target.gameIds.push(gameId);
  builderState.selectedCarouselId = target.id;
}

function removeGame(carouselId, gameId) {
  const carousel = getCarousel(carouselId);
  if (!carousel) return;
  carousel.gameIds = carousel.gameIds.filter((id) => id !== gameId);
}

function getCarousel(id) {
  return builderState.carousels.find((carousel) => carousel.id === id);
}

function isGameInMyCasino(gameId) {
  return builderState.carousels.some((carousel) => carousel.gameIds.includes(gameId));
}

function handleDragStart(event) {
  if (event.target.closest("button, a, input, select, textarea")) return;
  const metricCard = event.target.closest("[data-metric-id]");
  if (metricCard) {
    draggedMetricId = metricCard.dataset.metricId;
    draggedMetricDashboardId = metricCard.closest("[data-dashboard-metrics]")?.dataset.dashboardMetrics || "";
    if (!isDashboardEditing(draggedMetricDashboardId)) {
      draggedMetricId = "";
      draggedMetricDashboardId = "";
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `metric:${draggedMetricDashboardId}:${draggedMetricId}`);
    metricCard.classList.add("is-dragging");
    return;
  }

  const carouselHeader = event.target.closest(
    ".builder-carousel > header[data-carousel-drag-id]"
  );
  if (carouselHeader) {
    draggedCarouselId = carouselHeader.dataset.carouselDragId;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `carousel:${draggedCarouselId}`);
    carouselHeader.closest(".builder-carousel")?.classList.add("is-dragging");
    return;
  }

  const libraryCard = event.target.closest(".library-card[data-game-id]");
  const builderCard = event.target.closest(".builder-game-card[data-game-id]");
  if (!libraryCard && !builderCard) return;

  draggedGameId = (libraryCard || builderCard).dataset.gameId;
  draggedFromCarouselId = builderCard?.dataset.carouselId || "";
  event.dataTransfer.effectAllowed = draggedFromCarouselId ? "move" : "copy";
  event.dataTransfer.setData("text/plain", draggedGameId);
  (libraryCard || builderCard).classList.add("is-dragging");
}

function clearDragState() {
  draggedGameId = "";
  draggedFromCarouselId = "";
  draggedCarouselId = "";
  draggedMetricId = "";
  draggedMetricDashboardId = "";
  document
    .querySelectorAll(".is-drag-over, .is-carousel-drop-over, .is-metric-drop-over, .is-drop-before, .is-drop-after, .is-dragging")
    .forEach((node) =>
      node.classList.remove(
        "is-drag-over",
        "is-carousel-drop-over",
        "is-metric-drop-over",
        "is-drop-before",
        "is-drop-after",
        "is-dragging"
      )
    );
}

function handleDragOver(event) {
  const metricDrop = event.target.closest("[data-dashboard-metrics]");
  if (
    metricDrop &&
    draggedMetricId &&
    metricDrop.dataset.dashboardMetrics === draggedMetricDashboardId &&
    isDashboardEditing(draggedMetricDashboardId)
  ) {
    event.preventDefault();
    document
      .querySelectorAll(".is-metric-drop-over, .is-drop-before, .is-drop-after")
      .forEach((node) => node.classList.remove("is-metric-drop-over", "is-drop-before", "is-drop-after"));
    metricDrop.classList.add("is-metric-drop-over");
    const targetMetric = event.target.closest("[data-metric-id]");
    if (targetMetric && targetMetric.dataset.metricId !== draggedMetricId) {
      const rect = targetMetric.getBoundingClientRect();
      targetMetric.classList.add(
        event.clientX < rect.left + rect.width / 2
          ? "is-drop-before"
          : "is-drop-after"
      );
    }
    return;
  }

  const carouselDrop = event.target.closest(".builder-carousel[data-carousel-id]");
  if (carouselDrop && draggedCarouselId) {
    event.preventDefault();
    document
      .querySelectorAll(".is-carousel-drop-over")
      .forEach((node) => node.classList.remove("is-carousel-drop-over"));
    carouselDrop.classList.add("is-carousel-drop-over");
    return;
  }

  const dropZone = event.target.closest("[data-drop-carousel-id]");
  if (!dropZone || !draggedGameId) return;
  event.preventDefault();
  document
    .querySelectorAll(".is-drag-over, .is-drop-before, .is-drop-after")
    .forEach((node) =>
      node.classList.remove("is-drag-over", "is-drop-before", "is-drop-after")
    );
  dropZone.classList.add("is-drag-over");

  const targetCard = event.target.closest(".builder-game-card[data-game-id]");
  if (targetCard) {
    const rect = targetCard.getBoundingClientRect();
    targetCard.classList.add(
      event.clientX < rect.left + rect.width / 2
        ? "is-drop-before"
        : "is-drop-after"
    );
  }
}

function handleDrop(event) {
  const metricDrop = event.target.closest("[data-dashboard-metrics]");
  if (
    metricDrop &&
    draggedMetricId &&
    metricDrop.dataset.dashboardMetrics === draggedMetricDashboardId &&
    isDashboardEditing(draggedMetricDashboardId)
  ) {
    event.preventDefault();
    const metricIds = Array.from(metricDrop.querySelectorAll("[data-metric-id]"))
      .map((card) => card.dataset.metricId)
      .filter((id) => id && id !== draggedMetricId);
    const targetMetric = event.target.closest("[data-metric-id]");
    let targetIndex = targetMetric
      ? metricIds.indexOf(targetMetric.dataset.metricId)
      : metricIds.length;
    if (
      targetMetric &&
      event.clientX >= targetMetric.getBoundingClientRect().left + targetMetric.getBoundingClientRect().width / 2
    ) {
      targetIndex += 1;
    }
    metricIds.splice(Math.max(0, Math.min(targetIndex, metricIds.length)), 0, draggedMetricId);
    saveDashboardMetricOrder(draggedMetricDashboardId, metricIds);
    clearDragState();
    renderAnalyticsDashboard();
    return;
  }

  const carouselDrop = event.target.closest(".builder-carousel[data-carousel-id]");
  if (carouselDrop && draggedCarouselId) {
    event.preventDefault();
    reorderCarousel(draggedCarouselId, carouselDrop.dataset.carouselId);
    clearDragState();
    saveBuilderState();
    renderBuilder();
    return;
  }

  const dropZone = event.target.closest("[data-drop-carousel-id]");
  if (!dropZone || !draggedGameId) return;
  event.preventDefault();

  const targetCarouselId = dropZone.dataset.dropCarouselId;
  const targetCarousel = getCarousel(targetCarouselId);
  if (!targetCarousel) return;

  const targetCard = event.target.closest(".builder-game-card[data-game-id]");
  let targetIndex = targetCard
    ? Number(targetCard.dataset.gameIndex)
    : targetCarousel.gameIds.length;

  if (
    targetCard &&
    event.clientX >=
      targetCard.getBoundingClientRect().left +
        targetCard.getBoundingClientRect().width / 2
  ) {
    targetIndex += 1;
  }

  if (draggedFromCarouselId) {
    const sourceCarousel = getCarousel(draggedFromCarouselId);
    const sourceIndex = sourceCarousel?.gameIds.indexOf(draggedGameId) ?? -1;
    if (sourceCarousel) {
      sourceCarousel.gameIds = sourceCarousel.gameIds.filter(
        (id) => id !== draggedGameId
      );
    }
    if (
      sourceCarousel === targetCarousel &&
      sourceIndex >= 0 &&
      sourceIndex < targetIndex
    ) {
      targetIndex -= 1;
    }
  }

  targetCarousel.gameIds = targetCarousel.gameIds.filter(
    (id) => id !== draggedGameId
  );
  targetCarousel.gameIds.splice(
    Math.max(0, Math.min(targetIndex, targetCarousel.gameIds.length)),
    0,
    draggedGameId
  );
  builderState.selectedCarouselId = targetCarousel.id;
  clearDragState();
  saveBuilderState();
  renderBuilder();
}

function handleRepeatedClickCapture(event) {
  const target = event.target.closest(
    "button, a, input, select, .game-card, .library-card, .builder-game-card, .lottery-ball"
  );
  if (!target) return;

  const details = repeatedClickTargetDetails(target);
  if (!details.clickKey) return;
  window.PlayAILocalAnalytics?.trackRepeatedClick(details.clickKey, details);
}

function repeatedClickTargetDetails(target) {
  const gameCard = target.closest(".game-card[data-game-id]");
  if (gameCard) {
    return {
      clickKey: `game-card-${gameCard.dataset.gameId}`,
      component: "Game card",
      label: gameCard.dataset.gameName || gameCard.dataset.gameId,
      gameId: gameCard.dataset.gameId,
      sectionName: gameCard.dataset.sectionName
    };
  }

  if (target.closest("[data-play-url]")) {
    return {
      clickKey: `play-${target.closest(".game-card")?.dataset.gameId || "unknown"}`,
      component: "Play button",
      label: "Play"
    };
  }

  const routeLink = target.closest("[data-route-link]");
  if (routeLink) {
    return {
      clickKey: `nav-${routeLink.dataset.routeLink}`,
      component: routeLink.closest(".site-nav") ? "Primary navigation" : "Prototype tools",
      label: ROUTE_LABELS[routeLink.dataset.routeLink] || routeLink.dataset.routeLink,
      route: routeLink.dataset.routeLink
    };
  }

  const viewToggle = target.closest("[data-view-toggle]");
  if (viewToggle) {
    return {
      clickKey: `view-toggle-${viewToggle.dataset.viewToggle}`,
      component: "Lobby rail control",
      label: viewToggle.getAttribute("aria-pressed") === "true" ? "Carousel" : "View all"
    };
  }

  const lotteryBall = target.closest("[data-lottery-pick]");
  if (lotteryBall) {
    return {
      clickKey: `lottery-${lotteryBall.dataset.lotteryPick}-${lotteryBall.dataset.lotteryType}-${lotteryBall.dataset.lotteryValue}`,
      component: "Lottery number selector",
      label: `${lotteryBall.dataset.lotteryType} ${lotteryBall.dataset.lotteryValue}`,
      ticketIndex: Number(lotteryBall.dataset.lotteryPick)
    };
  }

  const lotteryDay = target.closest("[data-lottery-day]");
  if (lotteryDay) {
    const labels = { tue: "Tuesday", fri: "Friday", all: "All" };
    return {
      clickKey: `lottery-day-${lotteryDay.dataset.lotteryDay}`,
      component: "Lottery day selector",
      label: labels[lotteryDay.dataset.lotteryDay] || lotteryDay.dataset.lotteryDay
    };
  }

  const lotteryWeeks = target.closest("[data-lottery-weeks]");
  if (lotteryWeeks) {
    return {
      clickKey: `lottery-weeks-${lotteryWeeks.dataset.lotteryWeeks}`,
      component: "Lottery duration selector",
      label: `${lotteryWeeks.dataset.lotteryWeeks} weeks`
    };
  }

  const lotteryQuick = target.closest("[data-lottery-quick]");
  if (lotteryQuick) {
    return {
      clickKey: `lottery-quick-${lotteryQuick.dataset.lotteryQuick}`,
      component: "Lottery quick pick",
      label: `Quick pick ${lotteryQuick.dataset.lotteryQuick}`
    };
  }

  const lotteryRandom = target.closest("[data-lottery-random]");
  if (lotteryRandom) {
    return {
      clickKey: `lottery-random-${lotteryRandom.dataset.lotteryRandom}`,
      component: "Lottery dice",
      label: "Random numbers"
    };
  }

  const lotteryClear = target.closest("[data-lottery-clear]");
  if (lotteryClear) {
    return {
      clickKey: `lottery-clear-${lotteryClear.dataset.lotteryClear}`,
      component: "Lottery ticket clear",
      label: "Clear line"
    };
  }

  if (target.closest("[data-login-open]")) {
    return {
      clickKey: "login-open",
      component: "Login entry",
      label: "Log In"
    };
  }

  if (target.closest("[data-register-open]")) {
    const offerButton = target.closest("[data-offer-cta]");
    return {
      clickKey: offerButton ? `offer-cta-${offerButton.dataset.offerCta}` : "registration-open",
      component: offerButton ? "Homepage offer experiment" : "Registration entry",
      label: offerButton ? `${offerLabel(offerButton.dataset.offerCta)} Join Now` : "Join Now"
    };
  }

  if (target.closest("[data-login-join]")) {
    return {
      clickKey: "login-join",
      component: "Login modal",
      label: "Join"
    };
  }

  if (target.closest('[data-login-form] .login-submit[type="submit"]')) {
    return {
      clickKey: "login-submit",
      component: "Login modal",
      label: "Continue"
    };
  }

  if (target.closest("[data-login-close], [data-register-close]")) {
    return {
      clickKey: "modal-close",
      component: "Modal",
      label: "Close"
    };
  }

  const registerStepButton = target.closest("[data-register-step]");
  if (registerStepButton) {
    return {
      clickKey: `registration-${registerStepButton.dataset.registerStep}`,
      component: "Registration modal",
      label: registerStepButton.dataset.registerStep === "back" ? "Back" : "Continue"
    };
  }

  if (target.closest("[data-register-complete]")) {
    return {
      clickKey: "registration-complete",
      component: "Registration modal",
      label: "Complete concept flow"
    };
  }

  if (target.closest("[data-language-select]")) {
    return {
      clickKey: "language-selector",
      component: "Footer language selector",
      label: "Language"
    };
  }

  const action = target.dataset.builderAction || target.dataset.aiAction || target.dataset.lotteryAction;
  if (action) {
    return {
      clickKey: `action-${action}`,
      component: "Action button",
      label: TRACK_LABELS[action] || target.dataset.i18nDefault || action
    };
  }

  const namedField = target.name || target.dataset.builderField || target.dataset.loginField;
  if (namedField) {
    return {
      clickKey: `field-${namedField}`,
      component: "Form field",
      label: namedField
    };
  }

  const label = target.textContent?.trim();
  return {
    clickKey: label ? `ui-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 48)}` : "",
    component: target.tagName.toLowerCase(),
    label: target.dataset.i18nDefault || label
  };
}

function closeBubblegumStampedeModal() {
  document.getElementById("plai-bubblegum-game-modal")?.remove();
  document.body.classList.remove("plai-bubblegum-game-open");
}

function openBubblegumStampedeModal() {
  const styleId = "plai-bubblegum-game-style";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = [
      ".plai-bubblegum-game-modal { position: fixed; inset: 0; z-index: 10000; display: grid; place-items: center; padding: clamp(14px, 2.5vw, 36px); background: rgba(18, 5, 42, 0.84); backdrop-filter: blur(12px); }",
      ".plai-bubblegum-game-shell { width: min(96vw, 1480px); height: min(90vh, 920px); overflow: hidden; border: 1px solid rgba(255,255,255,0.28); border-radius: 22px; background: #2b0a65; box-shadow: 0 30px 90px rgba(18, 5, 42, 0.55); }",
      ".plai-bubblegum-game-bar { height: 68px; display: flex; align-items: center; gap: 14px; padding: 0 20px; color: #fff; background: linear-gradient(90deg, #42107b, #ff43ad); }",
      ".plai-bubblegum-game-pill { display: inline-flex; align-items: center; min-height: 28px; padding: 0 10px; background: #ffe95b; color: #211247; font-size: 13px; font-weight: 950; text-transform: uppercase; }",
      ".plai-bubblegum-game-title { min-width: 0; font-size: clamp(20px, 2vw, 28px); font-weight: 950; line-height: 1; }",
      ".plai-bubblegum-game-close { width: 48px; height: 48px; margin-left: auto; border: 0; border-radius: 999px; display: grid; place-items: center; color: #fff; background: rgba(255,255,255,0.2); font-size: 32px; font-weight: 900; cursor: pointer; }",
      ".plai-bubblegum-game-frame { display: block; width: 100%; height: calc(100% - 68px); border: 0; background: #2b0a65; }",
      "body.plai-bubblegum-game-open { overflow: hidden; }"
    ].join("\n");
    document.head.appendChild(style);
  }

  let modal = document.getElementById("plai-bubblegum-game-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "plai-bubblegum-game-modal";
    modal.className = "plai-bubblegum-game-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Bubblegum Stampede");
    const gameUrl = new URL("games/bubblegum-stampede/index.html?v=20260705-game", window.location.href).toString();
    modal.innerHTML = [
      '<div class="plai-bubblegum-game-shell" role="document">',
      '<div class="plai-bubblegum-game-bar">',
      '<span class="plai-bubblegum-game-pill">Exclusive</span>',
      '<strong class="plai-bubblegum-game-title">Bubblegum Stampede</strong>',
      '<button class="plai-bubblegum-game-close" type="button" aria-label="Close Bubblegum Stampede">&times;</button>',
      '</div>',
      '<iframe class="plai-bubblegum-game-frame" title="Bubblegum Stampede" src="' + gameUrl + '" loading="eager" allow="autoplay; fullscreen"></iframe>',
      '</div>'
    ].join("");
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".plai-bubblegum-game-close")) {
        closeBubblegumStampedeModal();
      }
    });
  }
  document.body.classList.add("plai-bubblegum-game-open");
  window.requestAnimationFrame(() => modal.querySelector("iframe")?.focus?.());
}

function handleGameNavigation(event) {
  const card = event.target.closest("[data-play-url]");
  if (!card) return;

  event.preventDefault();
  pendingPlayUrl = card.dataset.playUrl || "";
  const gameCard = card.closest(".game-card");
  const game = currentGames.find((item) => item.id === gameCard?.dataset.gameId);
  const properties = gameAnalyticsProperties(game, {
    sectionName: gameCard?.dataset.sectionName,
    position: gameCard?.dataset.position
  });
  trackUxEvent("Game Selected", properties);
  if (properties.sectionName) {
    trackCarouselUsed({
      carouselName: properties.sectionName,
      action: "game-selected",
      gameName: properties.gameName,
      position: properties.position
    });
  }
  window.PlayAILocalAnalytics?.trackRepeatedClick(
    `game-${gameCard?.dataset.gameId || "unknown"}`,
    properties
  );
  openBubblegumStampedeModal();
}

function handleGameCardKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest(".game-card[data-play-url]");
  if (!card) return;
  event.preventDefault();
  card.click();
}

function handleLoginClick(event) {
  const opener = event.target.closest("[data-login-open]");
  if (opener) {
    pendingPlayUrl = "";
    openLoginModal();
    return;
  }

  if (event.target.closest("[data-login-close]")) {
    closeLoginModal();
    return;
  }

  if (event.target.closest("[data-login-join]")) {
    closeLoginModal();
    registerVariant = registerVariant === "single" ? "stepped" : "single";
    registerStep = 0;
    storageSet({
      impossibleRegisterVariant: registerVariant
    });
    openRegistrationModal();
  }
}

function handleLoginSubmit(event) {
  if (!event.target.matches("[data-login-form]")) return;
  event.preventDefault();
  trackUxEvent("Login Continue Clicked", {
    component: "Login modal"
  });
  renderLoginComplete();
}

function handleLoginFieldFocus(event) {
  if (!event.target.closest("[data-login-form]")) return;
  if (!event.target.matches("[data-login-field]")) return;
  const fieldName = event.target.dataset.loginField;
  if (loginFunnelFieldsSeen.has(fieldName)) return;
  loginFunnelFieldsSeen.add(fieldName);
  trackUxEvent("Login Field Reached", {
    component: "Login modal",
    fieldName,
    fieldLabel: fieldName === "email" ? "Email address" : "Password"
  });
}

function openLoginModal() {
  if (!loginModal) return;
  loginModal.hidden = false;
  document.body.classList.add("has-modal");
  loginFunnelFieldsSeen = new Set();
  trackUxEvent("Login Started", {
    component: "Login modal",
    source: pendingPlayUrl ? "play-button" : "header-login"
  });
  renderLoginForm();
  requestAnimationFrame(() =>
    loginModal.querySelector("input, button")?.focus()
  );
}

function closeLoginModal() {
  if (!loginModal) return;
  loginModal.hidden = true;
  if (!registerModal || registerModal.hidden) {
    document.body.classList.remove("has-modal");
  }
}

function renderLoginForm() {
  if (!loginForm) return;
  loginForm.className = "login-panel";
  loginForm.setAttribute("autocomplete", "off");
  const loginSuffix = pendingPlayUrl ? t("continuePlaying") : ".";
  loginForm.innerHTML = `
    <span class="login-mark" aria-hidden="true">★</span>
    <div class="login-heading">
      <h2 id="login-title">${escapeHtml(t("welcomeBack"))}</h2>
      <p>${escapeHtml(t("loginCopy", { suffix: loginSuffix }))}</p>
    </div>
    <label>
      <span>${escapeHtml(t("emailAddress"))}</span>
      <input type="text" name="demo-login-user" inputmode="email" autocomplete="off" autocapitalize="none" spellcheck="false" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-login-field="email">
    </label>
    <label>
      <span>${escapeHtml(t("password"))}</span>
      <input type="password" name="demo-login-secret" autocomplete="off" autocapitalize="none" spellcheck="false" data-form-type="other" data-lpignore="true" data-1p-ignore="true" data-login-field="password">
    </label>
    <button class="login-submit" type="submit">${escapeHtml(t("continue"))}</button>
    <p class="login-join-copy">${escapeHtml(t("newToImpossible"))} <button type="button" data-login-join>${escapeHtml(t("join"))}</button></p>
  `;
  if (selectedBrandId() === "lottoland") {
    loginForm.querySelector(".login-join-copy")?.firstChild?.replaceWith("New to Lottoland? ");
  }
  applyBrandContent();
}

function renderLoginComplete() {
  if (!loginForm) return;
  loginForm.className = "login-panel is-complete";
  loginForm.innerHTML = `
    <div class="login-success">
      <span aria-hidden="true">✓</span>
      <h2>${escapeHtml(t("signedInTitle"))}</h2>
      <p>${escapeHtml(t("signedInCopy"))}</p>
      <button class="login-submit" type="button" data-login-close>${escapeHtml(pendingPlayUrl ? t("backToGames") : t("close"))}</button>
    </div>
  `;
}

function handleAiStudioInput(event) {
  if (!event.target.closest("[data-studio-prompt], [data-studio-scope], [data-studio-safety]")) return;
  renderAiStudioPreview({
    prompt: studioPromptNode?.value || "",
    scope: studioScopeNode?.value || "site",
    safety: studioSafetyNode?.value || "draft"
  });
}

function handleAiStudioClick(event) {
  const actionButton = event.target.closest("[data-studio-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.studioAction;
  if (action === "preview") {
    createAiStudioRequest("draft");
  } else if (action === "send") {
    createAiStudioRequest("queued");
  } else if (action === "rollback") {
    rollbackAiStudioChange();
  } else if (action === "copy") {
    copyAiStudioBrief();
  } else if (action === "mark-executed") {
    updateAiStudioRequestStatus(actionButton.dataset.requestId, "executed");
  } else if (action === "reopen") {
    reopenAiStudioRequest(actionButton.dataset.requestId);
  } else if (action === "restore-rollback") {
    restoreAiStudioRollback(Number(actionButton.dataset.rollbackIndex));
  }
}

function loadAiStudioState() {
  const style = localStorage.getItem(AI_STUDIO_STYLE_KEY) || "";
  document.body.dataset.aiStudioStyle = style;
  updateStudioDockContext();
  renderAiStudioPreview({
    prompt: studioPromptNode?.value || "",
    scope: studioScopeNode?.value || "site",
    safety: studioSafetyNode?.value || "draft"
  });
  renderAiStudioHistory();
}

function createAiStudioRequest(status, overrides = {}) {
  const prompt = (overrides.prompt ?? studioPromptNode?.value ?? "").trim();
  const scope = overrides.scope || studioScopeNode?.value || "site";
  const safety = overrides.safety || studioSafetyNode?.value || "draft";

  if (!prompt) {
    updateAiStudioStatus("Add a prompt first");
    renderAiStudioPreview({ prompt, scope, safety });
    return;
  }

  const request = {
    id: `studio-${Date.now()}`,
    prompt,
    scope,
    safety,
    status,
    style: inferAiStudioStyle(prompt),
    source: overrides.source || "Studio",
    context: overrides.context || currentPromptContext(),
    createdAt: new Date().toISOString()
  };
  request.brief = buildAiStudioBrief(request);

  if (status === "queued" || safety === "safe") {
    applyAiStudioStyle(request.style);
  }

  const requests = readAiStudioRequests();
  requests.unshift(request);
  writeAiStudioRequests(requests.slice(0, 20));
  updateAiStudioStatus(status === "queued" ? "Queued for Codex" : "Draft brief ready");
  trackUxEvent(status === "queued" ? "Studio Prompt Queued" : "Studio Brief Previewed", {
    component: "Studio",
    scope,
    safety,
    style: request.style
  });
  renderAiStudioPreview(request);
  renderAiStudioHistory();
  return request;
}

function inferAiStudioStyle(prompt) {
  const text = prompt.toLowerCase();
  if (/premium|richer|professional|polish|luxury/.test(text)) return "premium";
  if (/sparkle|star|magic|playful|bubblegum/.test(text)) return "sparkle";
  if (/calm|simple|clean|less busy|minimal/.test(text)) return "calm";
  if (/contrast|accessible|readable|bigger|larger/.test(text)) return "contrast";
  return "draft";
}

function applyAiStudioStyle(style) {
  const current = document.body.dataset.aiStudioStyle || "";
  const rollback = readAiStudioRollback();
  rollback.unshift({
    style: current,
    restoredAt: new Date().toISOString()
  });
  localStorage.setItem(AI_STUDIO_ROLLBACK_KEY, JSON.stringify(rollback.slice(0, 8)));
  localStorage.setItem(AI_STUDIO_STYLE_KEY, style);
  document.body.dataset.aiStudioStyle = style;
}

function rollbackAiStudioChange() {
  const rollback = readAiStudioRollback();
  if (!rollback.length) {
    updateAiStudioStatus("No rollback point yet");
    return;
  }
  const previous = rollback.shift();
  localStorage.setItem(AI_STUDIO_ROLLBACK_KEY, JSON.stringify(rollback));
  localStorage.setItem(AI_STUDIO_STYLE_KEY, previous.style || "");
  document.body.dataset.aiStudioStyle = previous.style || "";
  updateAiStudioStatus("Rolled back local style");
  trackUxEvent("AI Studio Rollback Used", {
    component: "AI Studio",
    restoredStyle: previous.style || "default"
  });
}

async function copyAiStudioBrief() {
  const [latest] = readAiStudioRequests();
  if (!latest?.brief) {
    updateAiStudioStatus("Create a brief first");
    return;
  }
  try {
    await navigator.clipboard.writeText(latest.brief);
    updateAiStudioStatus("Brief copied");
  } catch {
    updateAiStudioStatus("Copy unavailable");
  }
}

function buildAiStudioBrief(request) {
  const styleInstruction =
    request.style === "premium"
      ? "Lean into richer spacing, sharper hierarchy, deeper contrast and more polished card treatments."
      : request.style === "sparkle"
        ? "Increase the playful Impossible brand energy with tasteful stars, glow and bubblegum highlights."
        : request.style === "calm"
          ? "Reduce visual noise, simplify decorative elements and make the experience feel cleaner."
          : request.style === "contrast"
            ? "Prioritise readability, larger text, stronger contrast and clearer active states."
            : "Interpret the prompt and propose the smallest safe site change that satisfies it.";

  return [
    "Studio request for Codex",
    "",
    `Prompt: ${request.prompt}`,
    `Scope: ${request.scope}`,
    `Safety mode: ${request.safety}`,
    `Source: ${request.source || "Studio"}`,
    `Context: ${request.context || "No page context captured"}`,
    `Suggested local style: ${request.style}`,
    "",
    "Implementation guidance:",
    styleInstruction,
    "Keep the Impossible Casino brand system intact: elephant, star motif, deep purple, pink actions and yellow highlights.",
    "Avoid unrelated refactors. Preserve existing routes, analytics events and documentation unless the prompt explicitly changes them.",
    "",
    "Acceptance checks:",
    "- The requested change is visible in the scoped area.",
    "- Primary navigation, Studio, UX, Experiment, Intelligence and Knowledge still route correctly.",
    "- Login, registration, My Casino builder and lottery controls remain usable.",
    "- JavaScript syntax checks pass."
  ].join("\n");
}

function renderAiStudioPreview(request) {
  if (!studioPreviewNode) return;
  const prompt = request.prompt || "";
  const style = request.style || inferAiStudioStyle(prompt);
  const scope = request.scope || "site";
  const safety = request.safety || "draft";
  const brief = prompt
    ? buildAiStudioBrief({
        prompt,
        scope,
        safety,
        style,
        source: request.source,
        context: request.context
      })
    : "Enter a prompt to create a scoped implementation brief.";

  studioPreviewNode.innerHTML = `
    <h3>Change preview</h3>
    <div class="studio-brief-meta">
      <span>${escapeHtml(scope)}</span>
      <span>${escapeHtml(safety)}</span>
      <span>${escapeHtml(style)}</span>
    </div>
    <pre>${escapeHtml(brief)}</pre>
  `;
}

function renderAiStudioHistory() {
  if (!studioHistoryNode) return;
  const requests = readAiStudioRequests();
  studioHistoryNode.innerHTML = `
    <div class="studio-queue">
      <h4>Prompt execution queue</h4>
      ${requests.map((request) => `
        <article class="studio-history-card is-${escapeHtml(request.status)}">
          <header>
            <strong>${escapeHtml(aiStudioStatusLabel(request.status))}</strong>
            <span>${formatEventTime(request.createdAt)}</span>
          </header>
          <p>${escapeHtml(request.prompt)}</p>
          <small>${escapeHtml(request.scope)} · ${escapeHtml(request.safety)} · ${escapeHtml(request.style)} · ${escapeHtml(request.source || "Studio")}</small>
          ${request.context ? `<em>${escapeHtml(request.context)}</em>` : ""}
          <div>
            <button type="button" data-studio-action="reopen" data-request-id="${escapeHtml(request.id)}">Reopen</button>
            ${
              request.status === "queued"
                ? `<button type="button" data-studio-action="mark-executed" data-request-id="${escapeHtml(request.id)}">Mark executed</button>`
                : ""
            }
          </div>
        </article>
      `).join("") || "<p>No Studio prompts yet.</p>"}
    </div>
  `;
}

function aiStudioStatusLabel(status) {
  if (status === "queued") return "Queued for Codex";
  if (status === "executed") return "Executed";
  return "Draft";
}

function updateAiStudioRequestStatus(requestId, status) {
  const requests = readAiStudioRequests();
  const request = requests.find((item) => item.id === requestId);
  if (!request) return;
  request.status = status;
  request.executedAt = new Date().toISOString();
  writeAiStudioRequests(requests);
  updateAiStudioStatus(status === "executed" ? "Prompt marked executed" : "Prompt updated");
  trackUxEvent("AI Studio Prompt Status Changed", {
    component: "AI Studio",
    requestId,
    status
  });
  renderAiStudioHistory();
}

function reopenAiStudioRequest(requestId) {
  const request = readAiStudioRequests().find((item) => item.id === requestId);
  if (!request) return;
  if (studioPromptNode) studioPromptNode.value = request.prompt || "";
  if (studioScopeNode) studioScopeNode.value = request.scope || "site";
  renderAiStudioPreview(request);
  updateAiStudioStatus("Prompt reopened");
}

function restoreAiStudioRollback(index) {
  const rollback = readAiStudioRollback();
  const item = rollback[index];
  if (!item) return;
  localStorage.setItem(AI_STUDIO_STYLE_KEY, item.style || "");
  document.body.dataset.aiStudioStyle = item.style || "";
  updateAiStudioStatus("Rollback point restored");
  trackUxEvent("AI Studio Rollback Restored", {
    component: "AI Studio",
    restoredStyle: item.style || "default"
  });
  renderAiStudioHistory();
}

function updateAiStudioStatus(message) {
  if (!studioStatusNode) return;
  studioStatusNode.textContent = message;
  studioStatusNode.classList.toggle("is-active", !/No change|Add a prompt|No rollback|unavailable/.test(message));
}

function readAiStudioRequests() {
  try {
    return JSON.parse(localStorage.getItem(AI_STUDIO_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeAiStudioRequests(requests) {
  localStorage.setItem(AI_STUDIO_KEY, JSON.stringify(requests));
}

function readAiStudioRollback() {
  try {
    return JSON.parse(localStorage.getItem(AI_STUDIO_ROLLBACK_KEY) || "[]");
  } catch {
    return [];
  }
}

function currentPromptContext() {
  const route = normaliseRoute(location.hash);
  const routeLabel = ROUTE_LABELS[route] || route;
  const visibleSection = document.querySelector("[data-page]:not([hidden])");
  const heading = visibleSection?.querySelector("h1, h2, h3")?.textContent?.trim();
  return `Viewing ${routeLabel}${heading ? ` - ${heading}` : ""}`;
}

function updateStudioDockContext() {
  if (!studioDockContextNode) return;
  studioDockContextNode.textContent = currentPromptContext();
  const route = normaliseRoute(location.hash);
  if (studioDockScopeNode && !PLAYAI_ROUTES.has(route)) {
    studioDockScopeNode.value = route === "games" || route === "live" || route === "bingo" ? "site" : route;
  }
}

function handleStudioDockClick(event) {
  if (event.target.closest("[data-studio-dock-toggle]")) {
    toggleStudioDock();
    return;
  }
  if (event.target.closest("[data-studio-dock-close]")) {
    closeStudioDock();
    return;
  }

  const actionButton = event.target.closest("[data-dock-action]");
  if (!actionButton) return;

  const prompt = studioDockPromptNode?.value || "";
  const scope = studioDockScopeNode?.value || normaliseRoute(location.hash);
  const status = actionButton.dataset.dockAction === "send" ? "queued" : "draft";
  const request = createAiStudioRequest(status, {
    prompt,
    scope,
    source: "Studio Dock",
    context: currentPromptContext()
  });

  if (request && studioPromptNode) {
    studioPromptNode.value = request.prompt;
  }
  if (request && studioScopeNode) {
    studioScopeNode.value = request.scope;
  }
}

function readStudioDockPosition() {
  try {
    const position = JSON.parse(localStorage.getItem(AI_STUDIO_DOCK_KEY) || "{}");
    return Number.isFinite(position.left) && Number.isFinite(position.top) ? position : null;
  } catch {
    return null;
  }
}

function constrainStudioDockPosition(left, top) {
  if (!studioDockNode) return { left, top };
  const maxLeft = Math.max(12, window.innerWidth - studioDockNode.offsetWidth - 12);
  const maxTop = Math.max(58, window.innerHeight - studioDockNode.offsetHeight - 12);
  return {
    left: Math.min(Math.max(12, left), maxLeft),
    top: Math.min(Math.max(58, top), maxTop)
  };
}

function restoreStudioDockPosition() {
  if (!studioDockNode) return;
  const position = readStudioDockPosition();
  if (!position) return;
  const next = constrainStudioDockPosition(position.left, position.top);
  studioDockNode.style.left = `${next.left}px`;
  studioDockNode.style.top = `${next.top}px`;
  studioDockNode.style.right = "auto";
}

function handleStudioDockPointerDown(event) {
  if (!studioDockNode || studioDockNode.hidden) return;
  const header = event.target.closest("[data-studio-dock] header");
  if (!header || event.target.closest("button")) return;
  const rect = studioDockNode.getBoundingClientRect();
  studioDockDragState = {
    pointerId: event.pointerId,
    offsetX: event.clientX - rect.left,
    offsetY: event.clientY - rect.top
  };
  studioDockNode.classList.add("is-dragging");
  header.setPointerCapture?.(event.pointerId);
  event.preventDefault();
}

function handleStudioDockPointerMove(event) {
  if (!studioDockDragState || !studioDockNode) return;
  const next = constrainStudioDockPosition(
    event.clientX - studioDockDragState.offsetX,
    event.clientY - studioDockDragState.offsetY
  );
  studioDockNode.style.left = `${next.left}px`;
  studioDockNode.style.top = `${next.top}px`;
  studioDockNode.style.right = "auto";
}

function handleStudioDockPointerUp() {
  if (!studioDockDragState || !studioDockNode) return;
  studioDockDragState = null;
  studioDockNode.classList.remove("is-dragging");
  const rect = studioDockNode.getBoundingClientRect();
  localStorage.setItem(AI_STUDIO_DOCK_KEY, JSON.stringify({ left: rect.left, top: rect.top }));
}

function toggleStudioDock(forceOpen) {
  if (!studioDockNode) return;
  const shouldOpen = forceOpen ?? studioDockNode.hidden;
  studioDockNode.hidden = !shouldOpen;
  document.body.classList.toggle("has-studio-dock", shouldOpen);
  updateStudioDockContext();
  if (shouldOpen) {
    restoreStudioDockPosition();
    studioDockPromptNode?.focus();
    trackUxEvent("AI Studio Dock Opened", {
      component: "AI Studio",
      context: currentPromptContext()
    });
  }
}

function closeStudioDock() {
  if (!studioDockNode) return;
  studioDockNode.hidden = true;
  document.body.classList.remove("has-studio-dock");
}

function defaultWidgetState() {
  return {
    serviceBanner: {
      enabled: false,
      location: "top-nav",
      tone: "notice",
      message: "Paypal deposits are currently unavailable, please use an alternative payment method."
    },
    lotteryHelper: {
      enabled: false,
      displayMode: "once"
    },
    featureSwitches: {
      depositLimits: {
        enabled: false,
        market: "uk",
        period: "weekly"
      }
    }
  };
}

function readWidgetState() {
  try {
    const defaults = defaultWidgetState();
    const saved = JSON.parse(localStorage.getItem(AI_WIDGETS_KEY) || "{}");
    return {
      serviceBanner: {
        ...defaults.serviceBanner,
        ...(saved.serviceBanner || {})
      },
      lotteryHelper: {
        ...defaults.lotteryHelper,
        ...(saved.lotteryHelper || {}),
        displayMode: saved.lotteryHelper?.displayMode || (saved.lotteryHelper?.startOpen === false ? "once" : defaults.lotteryHelper.displayMode)
      },
      featureSwitches: {
        depositLimits: {
          ...defaults.featureSwitches.depositLimits,
          ...(saved.featureSwitches?.depositLimits || {})
        }
      }
    };
  } catch {
    return defaultWidgetState();
  }
}

function writeWidgetState(state) {
  localStorage.setItem(AI_WIDGETS_KEY, JSON.stringify(state));
}

function loadWidgetState() {
  syncPlayAiTitleEditors();
  syncWidgetControls(readWidgetState());
  renderWidgetSummary();
  renderWidgets();
  renderWidgetPreview();
  renderFeaturePreview();
  setConfigCardsReviewMode();
}

function syncWidgetControls(state) {
  const banner = state.serviceBanner || defaultWidgetState().serviceBanner;
  const lotteryHelper = state.lotteryHelper || defaultWidgetState().lotteryHelper;
  const depositLimits = state.featureSwitches?.depositLimits || defaultWidgetState().featureSwitches.depositLimits;
  const enabled = document.querySelector('[data-widget-field="service-enabled"]');
  const location = document.querySelector('[data-widget-field="service-location"]');
  const message = document.querySelector('[data-widget-field="service-message"]');
  const tone = document.querySelector('[data-widget-field="service-tone"]');
  const lotteryHelperEnabled = document.querySelector('[data-widget-field="lottery-helper-enabled"]');
  const lotteryHelperDisplayMode = document.querySelector('[data-widget-field="lottery-helper-display-mode"]');
  const featureEnabled = document.querySelector('[data-feature-field="deposit-limits-enabled"]');
  const market = document.querySelector('[data-feature-field="deposit-limits-market"]');
  const period = document.querySelector('[data-feature-field="deposit-limits-period"]');
  if (enabled) enabled.checked = Boolean(banner.enabled);
  if (location) location.value = banner.location || "top-nav";
  if (message) message.value = banner.message || "";
  if (tone) tone.value = banner.tone || "notice";
  if (lotteryHelperEnabled) lotteryHelperEnabled.checked = Boolean(lotteryHelper.enabled);
  if (lotteryHelperDisplayMode) lotteryHelperDisplayMode.value = lotteryHelper.displayMode || "once";
  if (featureEnabled) featureEnabled.checked = Boolean(depositLimits.enabled);
  if (market) market.value = depositLimits.market || "uk";
  if (period) period.value = depositLimits.period || "weekly";
}

function widgetStateFromControls() {
  const existing = readWidgetState();
  return {
    serviceBanner: {
      enabled: Boolean(document.querySelector('[data-widget-field="service-enabled"]')?.checked),
      location: document.querySelector('[data-widget-field="service-location"]')?.value || "top-nav",
      message:
        document.querySelector('[data-widget-field="service-message"]')?.value.trim() ||
        defaultWidgetState().serviceBanner.message,
      tone: document.querySelector('[data-widget-field="service-tone"]')?.value || "notice"
    },
    lotteryHelper: {
      enabled: Boolean(document.querySelector('[data-widget-field="lottery-helper-enabled"]')?.checked),
      displayMode: document.querySelector('[data-widget-field="lottery-helper-display-mode"]')?.value || "once"
    },
    featureSwitches: existing.featureSwitches
  };
}

function handleWidgetInput(event) {
  if (!event.target.closest("[data-widget-field], [data-playai-title-input]")) return;
  const card = event.target.closest(".widget-config-card");
  if (!card || !isConfigCardEditing(card)) return;
  setConfigStatus(card, "Unsaved changes", "dirty");
  renderWidgetPreview();
}

function handleWidgetClick(event) {
  const editButton = event.target.closest("[data-config-edit]");
  if (editButton) {
    const card = document.getElementById(editButton.dataset.configEdit);
    if (card) setConfigCardEditing(card, true, "Editing", "editing");
    return;
  }

  if (event.target.closest("[data-widget-dismiss]")) {
    event.target.closest(".service-banner")?.remove();
    trackUxEvent("Widget Dismissed", { widget: "Service message banner" });
    return;
  }

  const helperAction = event.target.closest("[data-lottery-helper-action]");
  if (helperAction) {
    handleLotteryHelperAction(helperAction);
    return;
  }

  const featureAction = event.target.closest("[data-feature-action]");
  if (featureAction) {
    if (featureAction.dataset.featureAction === "reset-deposit-limits") {
      const state = readWidgetState();
      state.featureSwitches.depositLimits = defaultWidgetState().featureSwitches.depositLimits;
      writeWidgetState(state);
      syncWidgetControls(state);
      renderWidgetSummary();
      renderFeaturePreview();
      setConfigCardEditing(document.getElementById("feature-deposit-limits"), false, "Reset", "saved");
      trackUxEvent("Feature Switch Reset", { feature: "Deposit limits" });
      return;
    }

    if (featureAction.dataset.featureAction === "save-deposit-limits") {
      const card = document.getElementById("feature-deposit-limits");
      const state = featureStateFromControls();
      savePlayAiTitleFromCard(card);
      writeWidgetState(state);
      renderWidgetSummary();
      renderFeaturePreview();
      setConfigCardEditing(card, false, "Saved just now", "saved");
      trackUxEvent("Feature Switch Saved", {
        feature: "Deposit limits",
        enabled: state.featureSwitches.depositLimits.enabled,
        market: state.featureSwitches.depositLimits.market,
        period: state.featureSwitches.depositLimits.period
      });
      return;
    }
  }

  const actionButton = event.target.closest("[data-widget-action]");
  if (!actionButton) return;

  if (actionButton.dataset.widgetAction === "reset-service") {
    const existing = readWidgetState();
    const state = {
      ...existing,
      serviceBanner: defaultWidgetState().serviceBanner
    };
    writeWidgetState(state);
    syncWidgetControls(state);
    renderWidgetSummary();
    renderWidgets();
    renderWidgetPreview();
    renderFeaturePreview();
    setConfigCardEditing(document.getElementById("widget-service-banner"), false, "Reset", "saved");
    trackUxEvent("Widget Reset", { widget: "Service message banner" });
    return;
  }

  if (actionButton.dataset.widgetAction === "save-service") {
    const card = document.getElementById("widget-service-banner");
    const state = widgetStateFromControls();
    savePlayAiTitleFromCard(card);
    writeWidgetState(state);
    renderWidgetSummary();
    renderWidgets();
    renderWidgetPreview();
    renderFeaturePreview();
    setConfigCardEditing(card, false, "Saved just now", "saved");
    trackUxEvent("Widget Saved", {
      widget: "Service message banner",
      enabled: state.serviceBanner.enabled,
      location: state.serviceBanner.location,
      tone: state.serviceBanner.tone
    });
  }

  if (actionButton.dataset.widgetAction === "save-lottery-helper") {
    const card = document.getElementById("widget-lottery-helper");
    const state = widgetStateFromControls();
    savePlayAiTitleFromCard(card);
    localStorage.removeItem(LOTTERY_HELPER_DISMISSED_KEY);
    writeWidgetState(state);
    renderWidgetSummary();
    renderWidgets();
    renderWidgetPreview();
    setConfigCardEditing(card, false, "Saved just now", "saved");
    trackUxEvent("Widget Saved", {
      widget: "Lottery helper",
      enabled: state.lotteryHelper.enabled,
      displayMode: state.lotteryHelper.displayMode
    });
  }

  if (actionButton.dataset.widgetAction === "reset-lottery-helper") {
    const existing = readWidgetState();
    const state = {
      ...existing,
      lotteryHelper: defaultWidgetState().lotteryHelper
    };
    localStorage.removeItem(LOTTERY_HELPER_DISMISSED_KEY);
    writeWidgetState(state);
    syncWidgetControls(state);
    renderWidgetSummary();
    renderWidgets();
    renderWidgetPreview();
    setConfigCardEditing(document.getElementById("widget-lottery-helper"), false, "Reset", "saved");
    trackUxEvent("Widget Reset", { widget: "Lottery helper" });
  }
}

function configCardFields(card) {
  return Array.from(card?.querySelectorAll("[data-widget-field], [data-feature-field], [data-playai-title-input]") || []);
}

function configCardSaveButtons(card) {
  return Array.from(card?.querySelectorAll("[data-widget-action], [data-feature-action]") || []);
}

function isConfigCardEditing(card) {
  return card?.dataset.editing === "true";
}

function setConfigStatus(card, text = "Saved", state = "saved") {
  const status = card?.querySelector("[data-config-status]");
  if (!status) return;
  status.textContent = text;
  status.dataset.state = state;
}

function setConfigCardEditing(card, editing, statusText = editing ? "Editing" : "Saved", statusState = editing ? "editing" : "saved") {
  if (!card) return;
  card.dataset.editing = editing ? "true" : "false";
  configCardFields(card).forEach((field) => {
    field.disabled = !editing;
  });
  card.querySelectorAll("[data-config-edit]").forEach((button) => {
    button.hidden = editing;
  });
  configCardSaveButtons(card).forEach((button) => {
    button.hidden = !editing;
  });
  syncConfigTitleEditor(card, editing);
  setConfigStatus(card, statusText, statusState);
}

function setConfigCardsReviewMode() {
  document.querySelectorAll(".widget-config-card").forEach((card) => {
    if (card.querySelector("[data-config-edit]")) {
      setConfigCardEditing(card, false);
    }
  });
}

function handleWorkspaceClick(event) {
  const backlogAddButton = event.target.closest("[data-backlog-add]");
  if (backlogAddButton) {
    event.preventDefault();
    addBacklogItemFromForm(backlogAddButton.closest("[data-backlog-create]"));
    return;
  }

  const backlogCancelButton = event.target.closest("[data-backlog-cancel]");
  if (backlogCancelButton) {
    event.preventDefault();
    updateBacklogItem(backlogCancelButton.dataset.backlogCancel, { status: "Cancelled" });
    setBacklogItemSelected(backlogCancelButton.dataset.backlogCancel, false);
    renderWorkspaceBacklog();
    return;
  }

  const backlogActionButton = event.target.closest("[data-backlog-action]");
  if (backlogActionButton) {
    event.preventDefault();
    handleBacklogDetailAction(backlogActionButton);
    return;
  }

  const backlogExportButton = event.target.closest("[data-backlog-export]");
  if (backlogExportButton) {
    event.preventDefault();
    exportBacklogBackup();
    return;
  }

  const refreshButton = event.target.closest("[data-refresh]");
  if (refreshButton) {
    event.preventDefault();
    loadGames({ force: true });
    return;
  }

  const launchButton = event.target.closest("[data-launch-market]");
  if (launchButton) {
    event.preventDefault();
    launchMarketSite(launchButton.dataset.launchMarket);
    return;
  }

  const promptButton = event.target.closest("[data-knowledge-prompt]");
  if (promptButton) {
    event.preventDefault();
    queueKnowledgePrompt(promptButton.dataset.knowledgePrompt);
    return;
  }

  const knowledgeActionButton = event.target.closest("[data-knowledge-action]");
  if (knowledgeActionButton) {
    event.preventDefault();
    handleKnowledgeAction(knowledgeActionButton);
    return;
  }

  const statusButton = event.target.closest("[data-knowledge-status]");
  if (statusButton) {
    event.preventDefault();
    setKnowledgeStatus(statusButton.dataset.knowledgeStatus, statusButton.dataset.statusValue);
    return;
  }

  const lockToggle = event.target.closest("[data-knowledge-lock]");
  if (lockToggle) {
    setKnowledgeRequirementLock(
      lockToggle.dataset.knowledgeLock,
      lockToggle.dataset.requirementIndex,
      lockToggle.checked
    );
    return;
  }
}

function launchMarketSite(marketId) {
  const market = PLAYAI_MARKETS.find((item) => item.id === marketId) || PLAYAI_MARKETS[0];
  const url = new URL(window.location.href);
  url.searchParams.set("launch", "site");
  url.hash = "home";
  window.open(url.toString(), "_blank", "noopener");
  trackUxEvent("Market Site Launched", {
    market: market?.name || "Impossible UK",
    route: "home"
  });
}

function readKnowledgeStatuses() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_KNOWLEDGE_STATUS_KEY) || "{}");
  } catch {
    return {};
  }
}

function knowledgeStatus(document) {
  const overrides = readKnowledgeStatuses();
  return overrides[document.id] || document.status || "Pending implementation";
}

function setKnowledgeStatus(documentId, status) {
  if (!documentId || !status) return;
  const statuses = readKnowledgeStatuses();
  statuses[documentId] = status;
  localStorage.setItem(PLAYAI_KNOWLEDGE_STATUS_KEY, JSON.stringify(statuses));
  renderKnowledgePage();
  renderAutomationPage();
}

function readKnowledgeLocks() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_KNOWLEDGE_LOCKS_KEY) || "{}");
  } catch {
    return {};
  }
}

function isKnowledgeRequirementLocked(documentId, requirementIndex) {
  return Boolean(readKnowledgeLocks()[documentId]?.[String(requirementIndex)]);
}

function setKnowledgeRequirementLock(documentId, requirementIndex, locked) {
  if (!documentId && documentId !== 0) return;
  const locks = readKnowledgeLocks();
  const key = String(documentId);
  locks[key] = {
    ...(locks[key] || {}),
    [String(requirementIndex)]: Boolean(locked)
  };
  localStorage.setItem(PLAYAI_KNOWLEDGE_LOCKS_KEY, JSON.stringify(locks));
  renderKnowledgePage();
}

function readKnowledgeRequirementOverrides() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_KNOWLEDGE_REQUIREMENTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeKnowledgeRequirementOverrides(overrides) {
  localStorage.setItem(PLAYAI_KNOWLEDGE_REQUIREMENTS_KEY, JSON.stringify(overrides));
}

function effectiveKnowledgeDocuments() {
  const requirementOverrides = readKnowledgeRequirementOverrides();
  return PLAYAI_KNOWLEDGE_DOCUMENTS.map((document) => ({
    ...document,
    requirements: Array.isArray(requirementOverrides[document.id])
      ? requirementOverrides[document.id]
      : document.requirements
  }));
}

function updateKnowledgeRequirements(documentId, requirements) {
  const overrides = readKnowledgeRequirementOverrides();
  const cleanedRequirements = requirements
    .map((item) => item.trim())
    .filter(Boolean);
  overrides[documentId] = cleanedRequirements;
  writeKnowledgeRequirementOverrides(overrides);
}

function handleKnowledgeAction(button) {
  const documentId = button.dataset.knowledgeId;
  const action = button.dataset.knowledgeAction;
  if (!documentId || !action) return;

  if (action === "edit") {
    activeKnowledgeEditId = documentId;
    renderKnowledgePage();
    return;
  }

  if (action === "cancel") {
    activeKnowledgeEditId = "";
    renderKnowledgePage();
    return;
  }

  const documentCard = document.querySelector(`[data-knowledge-document="${CSS.escape(documentId)}"]`);
  const documentData = effectiveKnowledgeDocuments().find((item) => item.id === documentId);
  if (!documentData) return;
  const requirements = Array.from(documentCard?.querySelectorAll("[data-knowledge-requirement-field]") || [])
    .map((field) => field.value);

  if (action === "add") {
    requirements.push("New requirement");
    updateKnowledgeRequirements(documentId, requirements);
    activeKnowledgeEditId = documentId;
    renderKnowledgePage();
    return;
  }

  if (action === "delete") {
    const deleteIndex = Number(button.dataset.requirementIndex);
    const nextRequirements = requirements.filter((_, index) => index !== deleteIndex);
    updateKnowledgeRequirements(documentId, nextRequirements);
    activeKnowledgeEditId = documentId;
    renderKnowledgePage();
    return;
  }

  if (action === "save") {
    updateKnowledgeRequirements(documentId, requirements);
    setKnowledgeStatus(documentId, "Pending implementation");
    activeKnowledgeEditId = "";
    renderKnowledgePage();
  }
}

function knowledgeDocumentPrompt(document) {
  const requirementList = document.requirements
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");
  return `${document.prompt}\n\nCurrent Knowledge requirements:\n${requirementList}`;
}

function knowledgePromptDiffMarkup(document) {
  const sourceDocument = PLAYAI_KNOWLEDGE_DOCUMENTS.find((item) => item.id === document.id);
  if (!sourceDocument) return "";
  const sourceRequirements = sourceDocument.requirements || [];
  const currentRequirements = document.requirements || [];
  const added = currentRequirements.filter((item) => !sourceRequirements.includes(item));
  const removed = sourceRequirements.filter((item) => !currentRequirements.includes(item));
  const changeCount = added.length + removed.length;

  return `
    <section class="workspace-requirement-panel knowledge-diff-panel">
      <h3>Prompt change preview</h3>
      <p>${changeCount
        ? `${changeCount} requirement change${changeCount === 1 ? "" : "s"} will be included in the generated Codex prompt.`
        : "No local requirement edits. The generated prompt matches the saved Knowledge document."}</p>
      ${added.length ? `
        <h4>Added requirements</h4>
        <ul>
          ${added.map((item) => `<li>${escapeHtml(item)} <span>Added</span></li>`).join("")}
        </ul>
      ` : ""}
      ${removed.length ? `
        <h4>Removed requirements</h4>
        <ul>
          ${removed.map((item) => `<li>${escapeHtml(item)} <span>Removed</span></li>`).join("")}
        </ul>
      ` : ""}
    </section>
  `;
}

function knowledgeRequirementConflict(document, requirement) {
  const text = requirement.toLowerCase();
  const isComplianceRelevant = /registration|cookie|consent|privacy|terms|18\+|deposit|limit|gambling|gdpr|pecr|ukgc/.test(
    `${document.title} ${document.area} ${text}`.toLowerCase()
  );
  if (!isComplianceRelevant) return false;
  return /optional.*(privacy|terms|18\+|cookie|consent)|remove.*(privacy|terms|18\+|cookie|consent)|under\s*18|disable.*(privacy|terms|18\+|cookie|consent)|ignore.*(gdpr|pecr|ukgc)/.test(text);
}

function queueKnowledgePrompt(documentId) {
  const document = effectiveKnowledgeDocuments().find((item) => item.id === documentId);
  if (!document) return;
  createAiStudioRequest("queued", {
    prompt: knowledgeDocumentPrompt(document),
    scope: "knowledge",
    safety: "draft",
    source: `Knowledge: ${document.title}`,
    context: `${document.market} · ${document.area}`
  });
  setKnowledgeStatus(document.id, "Pending implementation");
  renderKnowledgePage();
  renderAutomationPage();
}

function readBacklogSelection() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_BACKLOG_SELECTION_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeBacklogSelection(selection) {
  localStorage.setItem(PLAYAI_BACKLOG_SELECTION_KEY, JSON.stringify([...new Set(selection.map(String))]));
}

function readCustomBacklogItems() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_BACKLOG_CUSTOM_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCustomBacklogItems(items) {
  localStorage.setItem(PLAYAI_BACKLOG_CUSTOM_KEY, JSON.stringify(items));
}

function readBacklogOverrides() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_BACKLOG_OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeBacklogOverrides(overrides) {
  localStorage.setItem(PLAYAI_BACKLOG_OVERRIDES_KEY, JSON.stringify(overrides));
}

function backlogTimestamp() {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date());
}

function backlogAuditEntry(action, fromStatus, toStatus, actor = "System", note = "") {
  return {
    at: backlogTimestamp(),
    actor,
    action,
    fromStatus: fromStatus || "",
    toStatus: toStatus || "",
    note
  };
}

function normaliseBacklogAuditTrail(item) {
  return Array.isArray(item.auditTrail) ? item.auditTrail : [];
}

function reconcileBacklogState() {
  const sourceById = new Map(WORKSPACE_BACKLOG_ITEMS.map((item) => [String(item.id), item]));
  const terminalIds = new Set(
    WORKSPACE_BACKLOG_ITEMS
      .filter((item) => ["Implemented", "Signed off", "Cancelled"].includes(item.status))
      .map((item) => String(item.id))
  );
  const selectedIds = readBacklogSelection().map(String);
  const nextSelectedIds = selectedIds.filter((id) => !terminalIds.has(id));
  if (nextSelectedIds.length !== selectedIds.length) {
    writeBacklogSelection(nextSelectedIds);
  }

  const overrides = readBacklogOverrides();
  let changed = false;
  Object.keys(overrides).forEach((id) => {
    const sourceItem = sourceById.get(String(id));
    if (!sourceItem || !["Implemented", "Signed off", "Cancelled"].includes(sourceItem.status)) return;
    const nextOverride = { ...(overrides[id] || {}) };
    ["status", "priority", "effort", "area", "source"].forEach((field) => {
      if (field in nextOverride) {
        delete nextOverride[field];
        changed = true;
      }
    });
    if (Object.keys(nextOverride).length) overrides[id] = nextOverride;
    else delete overrides[id];
  });
  if (changed) writeBacklogOverrides(overrides);
  localStorage.setItem(PLAYAI_BACKLOG_STORAGE_VERSION_KEY, PLAYAI_BACKLOG_STORAGE_VERSION);
}

function assessBacklogItem(item) {
  const assessed = {
    ...item,
    source: item.source || "Human"
  };
  const text = `${assessed.area || ""} ${assessed.item || ""} ${assessed.detail || ""}`.toLowerCase();
  if (!assessed.area || assessed.area === "Unassessed") assessed.area = assessBacklogArea(text);
  if (!assessed.priority) assessed.priority = assessBacklogPriority(text);
  if (!assessed.effort) assessed.effort = assessBacklogEffort(text, assessed.priority);
  if (!assessed.benefit) assessed.benefit = assessBacklogBenefit(assessed.area, text);
  return assessed;
}

function assessBacklogArea(text) {
  if (/github|repository|repo|version control|git\b/.test(text)) return "Version control";
  if (/extension|chrome|brave/.test(text)) return "Extension packaging";
  if (/knowledge|requirement|compliance|regulation|gdpr|cookie|privacy|terms|locked/.test(text)) return "Knowledge";
  if (/dashboard|metric|chart|report|analytics|intelligence|event/.test(text)) return "Intelligence";
  if (/experiment|a\/b|ab test|variant|conversion/.test(text)) return "Experiment";
  if (/brand|theme|style leak|logo|lottoland|techno|bubble/.test(text)) return "Brands";
  if (/component|widget|deposit limit|lottery guide|consent|banner/.test(text)) return "Components";
  if (/backlog|queue|sign off|cancel|pick|workflow/.test(text)) return "Backlog workflow";
  if (/navigation|menu|side nav|sidebar|nav item/.test(text)) return "Navigation";
  if (/list|filter|table|row|column|pagination|page size/.test(text)) return "List standards";
  if (/form|registration|field|validation|helper text/.test(text)) return "Form standards";
  return "Workspace IA";
}

function assessBacklogPriority(text) {
  if (/compliance|regulation|gdpr|privacy|terms|cookie|broken|vanished|error|quota|source image|brand leak|non-compliant/.test(text)) return "High";
  if (/workflow|backlog|knowledge|dashboard|github|extension|navigation|component|widget|experiment/.test(text)) return "Medium";
  return "Low";
}

function assessBacklogEffort(text, priority) {
  if (/github|repository|knowledge.*edit|requirement line|dashboard.*create|side navigation|rename .*everywhere|extension|compliance document/.test(text)) return "Large";
  if (/colour|color|padding|align|hover|label|copy|button text|column|page size|filter/.test(text)) return "Small";
  if (priority === "High" && /brand leak|quota|broken|vanished/.test(text)) return "Medium";
  return priority === "Low" ? "Small" : "Medium";
}

function assessBacklogBenefit(area, text) {
  if (area === "Knowledge") return "Keeps requirements human-readable while making compliance and implementation expectations easier to trace.";
  if (area === "Components") return "Makes reusable customer-facing elements easier to configure, preview and govern across markets.";
  if (area === "Intelligence") return "Improves decision-making by separating collection rules from the dashboards that explain performance.";
  if (area === "Experiment") return "Helps reviewers understand active tests, risks and outcomes without digging through raw events.";
  if (area === "Brands") return "Reduces style leaks and makes theme switching safer for demos and future market launches.";
  if (area === "Backlog workflow") return "Makes the human-in-the-loop work queue clearer, easier to prioritise and safer to sign off.";
  if (area === "Navigation") return "Improves workspace orientation and helps reviewers move between sections with less friction.";
  if (area === "Version control") return "Creates safer checkpoints and collaboration options once the prototype is stable enough to share.";
  if (area === "Extension packaging") return "Aligns the browser extension with the product identity before wider testing.";
  if (area === "Form standards") return "Improves customer clarity and makes form behaviour consistent across registration, login and compliance journeys.";
  if (/performance|quota|storage/.test(text)) return "Keeps the prototype stable during longer reviews with larger event histories.";
  return "Improves workspace clarity and reduces manual review effort during demos and implementation planning.";
}

function readDeletedBacklogItems() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_BACKLOG_DELETED_KEY) || "[]").map(String);
  } catch {
    return [];
  }
}

function writeDeletedBacklogItems(itemIds) {
  localStorage.setItem(PLAYAI_BACKLOG_DELETED_KEY, JSON.stringify([...new Set(itemIds.map(String))]));
}

function baseWorkspaceBacklogItems() {
  return workspaceBacklogSourceItems.length ? workspaceBacklogSourceItems : WORKSPACE_BACKLOG_ITEMS;
}

function canUseBacklogApi() {
  return workspaceBacklogApiAvailable && workspaceBacklogSourceStatus === "sqlite-api";
}

function backlogApiItemUrl(itemId) {
  return `${PLAYAI_BACKLOG_API_URL}/${encodeURIComponent(itemId)}`;
}

async function fetchWorkspaceBacklogApi() {
  const response = await fetch(PLAYAI_BACKLOG_API_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Backlog API returned ${response.status}`);
  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : Array.isArray(payload) ? payload : [];
  if (!items.length) throw new Error("Backlog API did not contain any items.");
  return items;
}

function upsertWorkspaceBacklogSourceItem(nextItem) {
  const id = String(nextItem.id);
  const index = workspaceBacklogSourceItems.findIndex((item) => String(item.id) === id);
  if (index >= 0) workspaceBacklogSourceItems[index] = nextItem;
  else workspaceBacklogSourceItems.push(nextItem);
}

function removeWorkspaceBacklogSourceItem(itemId) {
  workspaceBacklogSourceItems = workspaceBacklogSourceItems.filter((item) => String(item.id) !== String(itemId));
}

async function persistBacklogItemToApi(itemId, patch) {
  if (!canUseBacklogApi()) return;
  try {
    const response = await fetch(backlogApiItemUrl(itemId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (!response.ok) throw new Error(`Backlog API save returned ${response.status}`);
    const payload = await response.json();
    if (payload.item) upsertWorkspaceBacklogSourceItem(assessBacklogItem(payload.item));
  } catch (error) {
    console.warn("Shared backlog save failed; keeping the visible change until the API is available again.", error);
  }
}

async function createBacklogItemViaApi(itemText) {
  const response = await fetch(PLAYAI_BACKLOG_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item: itemText })
  });
  if (!response.ok) throw new Error(`Backlog API create returned ${response.status}`);
  const payload = await response.json();
  if (!payload.item) throw new Error("Backlog API did not return the created item.");
  upsertWorkspaceBacklogSourceItem(assessBacklogItem(payload.item));
  return payload.item;
}

async function deleteBacklogItemViaApi(itemId) {
  if (!canUseBacklogApi()) return;
  try {
    const response = await fetch(backlogApiItemUrl(itemId), { method: "DELETE" });
    if (!response.ok) throw new Error(`Backlog API delete returned ${response.status}`);
  } catch (error) {
    console.warn("Shared backlog delete failed; refresh the backlog if this item reappears.", error);
  }
}

async function loadWorkspaceBacklogSource() {
  if (!globalThis.fetch) return;
  try {
    workspaceBacklogSourceItems = await fetchWorkspaceBacklogApi();
    workspaceBacklogSourceStatus = "sqlite-api";
    workspaceBacklogApiAvailable = true;
    reconcileBacklogState();
    if (currentRoute === "ai-backlog") renderWorkspaceBacklog();
    return;
  } catch (apiError) {
    workspaceBacklogApiAvailable = false;
    console.info("Shared backlog API unavailable; using the static project backlog.", apiError);
  }

  const response = await fetch(PLAYAI_BACKLOG_SOURCE_URL, { cache: "no-store" });
  if (!response.ok) throw new Error(`Backlog source returned ${response.status}`);
  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!items.length) throw new Error("Backlog source did not contain any items.");
  workspaceBacklogSourceItems = items;
  workspaceBacklogSourceStatus = "repository";
  reconcileBacklogState();
  if (currentRoute === "ai-backlog") renderWorkspaceBacklog();
}

function workspaceBacklogItems() {
  if (canUseBacklogApi()) {
    return baseWorkspaceBacklogItems().map((item) => assessBacklogItem(item));
  }
  const overrides = readBacklogOverrides();
  const deletedIds = new Set(readDeletedBacklogItems());
  return [...baseWorkspaceBacklogItems(), ...readCustomBacklogItems()]
    .filter((item) => !deletedIds.has(String(item.id)))
    .map((item) => assessBacklogItem({
      ...item,
      ...(overrides[String(item.id)] || {})
    }));
}

function nextBacklogItemId(items = workspaceBacklogItems()) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

function isBacklogItemSelected(item) {
  if (canUseBacklogApi()) return ["Approved", "In progress"].includes(effectiveBacklogStatus(item));
  return readBacklogSelection().includes(String(item.id));
}

function setBacklogItemSelected(itemId, selected) {
  const currentItem = workspaceBacklogItems().find((item) => String(item.id) === String(itemId));
  if (canUseBacklogApi()) {
    if (!currentItem) return;
    const currentStatus = effectiveBacklogStatus(currentItem);
    if (["Implemented", "In progress", "Signed off", "Cancelled"].includes(currentStatus)) {
      renderWorkspaceBacklog();
      return;
    }
    updateBacklogItem(itemId, { status: selected ? "Approved" : "Outstanding" }, {
      action: selected ? "Approved for implementation" : "Approval removed",
      actor: "Human"
    });
    renderWorkspaceBacklog();
    return;
  }
  const current = new Set(readBacklogSelection().map(String));
  if (selected) current.add(String(itemId));
  else current.delete(String(itemId));
  writeBacklogSelection([...current]);
  if (currentItem && !["Implemented", "Signed off", "Cancelled"].includes(effectiveBacklogStatus(currentItem))) {
    updateBacklogItem(itemId, {
      auditTrail: [
        ...normaliseBacklogAuditTrail(currentItem),
        backlogAuditEntry(selected ? "Approved for implementation" : "Approval removed", effectiveBacklogStatus(currentItem), selected ? "Approved" : currentItem.status, "Human")
      ]
    });
  }
  renderWorkspaceBacklog();
}

function updateBacklogItem(itemId, patch, audit = {}) {
  const id = String(itemId);
  const currentItem = workspaceBacklogItems().find((item) => String(item.id) === id);
  const currentStatus = currentItem ? effectiveBacklogStatus(currentItem) : "";
  const nextPatch = { ...patch };
  if (nextPatch.status && nextPatch.status !== currentStatus) {
    nextPatch.auditTrail = [
      ...normaliseBacklogAuditTrail(currentItem || {}),
      backlogAuditEntry(audit.action || "Status changed", currentStatus, nextPatch.status, audit.actor || "Human", audit.note || "")
    ];
  }
  if (nextPatch.status === "Implemented" && !nextPatch.implementationNote) {
    nextPatch.implementationNote = audit.implementationNote || "Implementation completed. Add specific release notes during review if more detail is needed.";
  }
  if (canUseBacklogApi()) {
    const sourceItem = workspaceBacklogSourceItems.find((item) => String(item.id) === id);
    if (sourceItem) {
      const nextItem = assessBacklogItem({
        ...sourceItem,
        ...nextPatch
      });
      upsertWorkspaceBacklogSourceItem(nextItem);
      persistBacklogItemToApi(id, nextPatch);
      return;
    }
  }
  const customItems = readCustomBacklogItems();
  const customIndex = customItems.findIndex((item) => String(item.id) === id);
  if (customIndex >= 0) {
    customItems[customIndex] = {
      ...customItems[customIndex],
      ...nextPatch
    };
    writeCustomBacklogItems(customItems);
  } else {
    const overrides = readBacklogOverrides();
    overrides[id] = {
      ...(overrides[id] || {}),
      ...nextPatch
    };
    writeBacklogOverrides(overrides);
  }
}

function deleteBacklogItem(itemId) {
  const id = String(itemId);
  if (canUseBacklogApi()) {
    removeWorkspaceBacklogSourceItem(id);
    deleteBacklogItemViaApi(id);
    return;
  }
  const customItems = readCustomBacklogItems();
  const nextCustomItems = customItems.filter((item) => String(item.id) !== id);
  if (nextCustomItems.length !== customItems.length) {
    writeCustomBacklogItems(nextCustomItems);
  } else {
    writeDeletedBacklogItems([...readDeletedBacklogItems(), id]);
  }
  const current = new Set(readBacklogSelection().map(String));
  current.delete(id);
  writeBacklogSelection([...current]);
}

const WORKSPACE_BACKLOG_ITEMS = [
  {
    id: 1,
    area: "Knowledge",
    item: "Move component toggles to market-level Knowledge documents",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 2,
    area: "Components",
    item: "Treat component screens as implementation records, not source of truth",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 3,
    area: "Studio",
    item: "Simplify Codex handoff now that PlayAI is a standalone app",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 4,
    area: "Intelligence",
    item: "Split collection requirements from dashboard/reporting requirements",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 5,
    area: "Navigation",
    item: "Move PlayAI from the top bar to a permanent side navigation with a larger work area",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 6,
    area: "Naming",
    item: "Rename Knowledge Base references consistently so the workspace uses Knowledge Base instead of Market knowledge base",
    priority: "Low",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 7,
    area: "Knowledge editing",
    item: "Create, edit, save and delete individual requirement lines, update the generated prompt, and highlight regulatory conflicts without blocking acceptance",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 8,
    area: "Knowledge compliance",
    item: "Highlight non-compliant Knowledge documents and add a dedicated non-compliant filter in the list view",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 9,
    area: "Form standards",
    item: "Add Knowledge requirements for field order, step order, validation rules and red helper text under invalid entries across every form",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 10,
    area: "Knowledge governance",
    item: "Allow individual requirement rows to be locked with a lock toggle so key requirements can show future control without adding access control yet",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 11,
    area: "List standards",
    item: "Always reset workspace navigation to list view and put All first in list filters",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 12,
    area: "Market config",
    item: "Keep catalogue refresh and component toggles inside market configuration rather than global workspace navigation",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 13,
    area: "Deposit limits",
    item: "Add rules in the Deposit Limits Knowledge Base for which amounts appear as quick buttons",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 14,
    area: "Workspace IA",
    item: "Introduce saved workspace views so reviewers can jump between Market setup, Knowledge review and launch-readiness views",
    priority: "Medium",
    status: "Implemented",
    source: "Codex",
    effort: "Medium",
    benefit: "Reduces navigation effort during demos and lets reviewers return to common work patterns quickly."
  },
  {
    id: 15,
    area: "Quality gates",
    item: "Add a launch-readiness checklist that rolls up Knowledge status, brand leaks, catalogue health and required compliance components",
    priority: "High",
    status: "Implemented",
    source: "Codex",
    effort: "Large",
    benefit: "Creates a clear pre-demo and pre-launch confidence check so missing compliance, brand or data items are visible early."
  },
  {
    id: 16,
    area: "Knowledge prompts",
    item: "Add prompt diff previews so reviewers can see exactly what a Knowledge change would ask Codex to update before queueing it",
    priority: "Medium",
    status: "Implemented",
    source: "Codex",
    effort: "Medium",
    benefit: "Improves trust in the Knowledge-to-Codex workflow by showing the impact before a change request is queued."
  },
  {
    id: 17,
    area: "Extension packaging",
    item: "Rename the Chrome extension to PlayAI and update the extension logo and description to match the workspace product",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 18,
    area: "List standards",
    item: "Add alternate row background shading to the shared PlayAI list renderer",
    priority: "Low",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 19,
    area: "Navigation",
    item: "Remove the Site option from PlayAI navigation because the customer site can be launched from the Markets area",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 20,
    area: "Navigation",
    item: "Vertically centre PlayAI side-nav items and add a subtle hover background state",
    priority: "Low",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 21,
    area: "Navigation",
    item: "When a user clicks the current PlayAI navigation item, return that area to its list view instead of leaving the detail view open",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 22,
    area: "Product branding",
    item: "Rename PlayAI to JackpotAI everywhere, including workspace labels, product copy, extension naming and supporting assets",
    priority: "Medium",
    status: "Cancelled",
    source: "Human"
  },
  {
    id: 23,
    area: "Backlog workflow",
    item: "Open backlog rows into a detail view with a back button, plus edit, save and delete controls before the item has started implementation",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 24,
    area: "Backlog capture",
    item: "Add a quick-entry row above the backlog table so new backlog items can be captured with Unassessed status and no priority until reviewed",
    priority: "High",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 25,
    area: "Backlog list",
    item: "Show the full backlog item description in the list by wrapping text within the row and final description cell",
    priority: "Medium",
    status: "Implemented",
    source: "Human"
  },
  {
    id: 26,
    area: "Version control",
    item: "Move the project into the existing GitHub repository plai-os/plai once the backlog and logo fixes are stable",
    priority: "Medium",
    status: "Outstanding",
    source: "Human",
    effort: "Medium",
    detail: "Steps: export the backlog JSON from the Backlog screen, make a clean project backup, move backlog source data into a repo-backed JSON/workspace data file so it is no longer dependent on browser storage, initialise Git for this folder if needed, create a first baseline checkpoint, connect the remote repository at https://github.com/plai-os/plai, push the baseline, then use branches for larger changes so demos can be rolled back safely."
  }
];

function handlePlayAiListNavigation(event) {
  const backlogControl = event.target.closest("[data-backlog-pickup], [data-backlog-cancel]");
  if (backlogControl) {
    event.stopPropagation();
    return;
  }

  const filterButton = event.target.closest("[data-list-filter]");
  if (filterButton) {
    const panel = filterButton.closest(".playai-list-panel");
    const filter = filterButton.dataset.listFilter || "all";
    if (!panel) return;
    const listId = panel.dataset.listId || "default";
    activePlayAiListFilters[listId] = filter;
    activePlayAiListPages[listId] = 1;
    panel.querySelectorAll("[data-list-filter]").forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });
    const select = panel.querySelector("[data-list-select]");
    if (select) select.value = filter;
    updatePlayAiListRows(panel);
    return;
  }

  const pageButton = event.target.closest("[data-list-page]");
  if (pageButton) {
    const panel = pageButton.closest(".playai-list-panel");
    if (!panel) return;
    const listId = panel.dataset.listId || "default";
    const direction = pageButton.dataset.listPage === "next" ? 1 : -1;
    activePlayAiListPages[listId] = Math.max(1, (activePlayAiListPages[listId] || 1) + direction);
    updatePlayAiListRows(panel);
    return;
  }

  const backButton = event.target.closest("[data-playai-back]");
  if (backButton) {
    const route = backButton.dataset.playaiBack;
    activePlayAiDetails[route] = "";
    renderPlayAiDetailMode(route);
    if (route === "ai-brands") renderBrandPage();
    if (route === "ai-markets") renderMarketPage();
    if (route === "ai-knowledge") renderKnowledgePage();
    if (route === "ai-backlog") renderWorkspaceBacklog();
    if (route === "ai-suggestions") renderSuggestionList();
    if (route === "ai-experiment") renderExperimentDashboard();
    if (route === "ai-widgets") renderWidgetSummary();
    if (route === "ai-automation") renderAutomationPage();
    if (route === "analytics") renderAnalyticsDashboard();
    return;
  }

  const row = event.target.closest(".playai-list-row");
  if (!row) return;
  const page = row.closest("[data-page]");
  const route = page?.dataset.page?.split(/\s+/)[0];
  const targetId = row.dataset.targetId;
  if (!route || !targetId || !(route in activePlayAiDetails)) return;
  event.preventDefault();
  activePlayAiDetails[route] = targetId;
  renderPlayAiDetailMode(route);
  document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "auto" });
}

function handlePlayAiListControls(event) {
  const backlogCheckbox = event.target.closest("input[data-backlog-pickup]");
  if (backlogCheckbox) {
    setBacklogItemSelected(backlogCheckbox.dataset.backlogPickup, backlogCheckbox.checked);
    return;
  }

  const select = event.target.closest("[data-list-select]");
  const search = event.target.closest("[data-list-search]");
  if (!select && !search) return;
  const panel = event.target.closest(".playai-list-panel");
  if (!panel) return;
  const listId = panel.dataset.listId || "default";
  if (select) {
    activePlayAiListFilters[listId] = select.value || "all";
    activePlayAiListPages[listId] = 1;
    panel.querySelectorAll("[data-list-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.listFilter === activePlayAiListFilters[listId]);
    });
  }
  if (search) {
    activePlayAiListQueries[listId] = search.value.trim().toLowerCase();
    activePlayAiListPages[listId] = 1;
  }
  updatePlayAiListRows(panel);
}

function updatePlayAiListRows(panel) {
  const listId = panel.dataset.listId || "default";
  const filter = activePlayAiListFilters[listId] || panel.querySelector("[data-list-select]")?.value || "all";
  const query = activePlayAiListQueries[listId] || "";
  const rows = [...panel.querySelectorAll(".playai-list-row")];
  const filteredRows = rows.filter((row) => {
    const rowFilters = (row.dataset.filter || "").split(/\s+/).filter(Boolean);
    const filterMatch = filter === "all" || rowFilters.includes(filter);
    const searchMatch = !query || (row.dataset.search || row.textContent || "").toLowerCase().includes(query);
    return filterMatch && searchMatch;
  });
  const pageSize = Number(panel.dataset.pageSize || 0);
  const maxPage = pageSize ? Math.max(1, Math.ceil(filteredRows.length / pageSize)) : 1;
  const currentPage = Math.min(activePlayAiListPages[listId] || 1, maxPage);
  activePlayAiListPages[listId] = currentPage;
  rows.forEach((row) => {
    const matchIndex = filteredRows.indexOf(row);
    const pageMatch = !pageSize || (matchIndex >= (currentPage - 1) * pageSize && matchIndex < currentPage * pageSize);
    row.hidden = matchIndex === -1 || !pageMatch;
  });
  const summary = panel.querySelector("[data-list-page-summary]");
  if (summary) {
    const start = filteredRows.length ? ((currentPage - 1) * pageSize) + 1 : 0;
    const end = pageSize ? Math.min(currentPage * pageSize, filteredRows.length) : filteredRows.length;
    summary.textContent = `${start}-${end} of ${filteredRows.length}`;
  }
  panel.querySelector("[data-list-page='prev']")?.toggleAttribute("disabled", currentPage <= 1);
  panel.querySelector("[data-list-page='next']")?.toggleAttribute("disabled", currentPage >= maxPage);
}

function detailBackMarkup(route, title) {
  return `
    <div class="playai-detail-bar">
      <button type="button" data-playai-back="${escapeHtml(route)}">Back to list</button>
    </div>
  `;
}

function renderPlayAiDetailMode(route) {
  if (route === "ai-backlog") {
    renderBacklogDetailMode();
  } else if (route === "ai-markets") {
    renderMarketDetailMode();
  } else if (route === "ai-knowledge") {
    renderKnowledgeDetailMode();
  } else if (route === "ai-brands") {
    renderBrandDetailMode();
  } else if (route === "ai-widgets") {
    renderWidgetDetailMode();
  } else if (route === "ai-suggestions") {
    renderSuggestionDetailMode();
  } else if (route === "ai-experiment") {
    renderExperimentDetailMode();
  } else if (route === "ai-automation") {
    renderAutomationDetailMode();
  } else if (route === "analytics") {
    renderAnalyticsDetailMode();
  }
}

function renderWorkspaceBacklog() {
  const targetNode = workspaceBacklogPageNode || workspaceBacklogNode;
  if (!targetNode) return;
  const activeId = activePlayAiDetails["ai-backlog"];
  if (activeId) {
    targetNode.innerHTML = backlogDetailMarkup(activeId);
    return;
  }
  const backlogRows = workspaceBacklogItems().map((item) => ({
    ...item,
    effectiveStatus: effectiveBacklogStatus(item),
    effort: item.effort || backlogEffort(item)
  }));
  const activeBacklogItems = backlogRows.filter((item) => !["Implemented", "Signed off", "Cancelled"].includes(item.effectiveStatus));
  targetNode.innerHTML = `
    ${backlogQuickAddMarkup()}
    ${playAiListPanelMarkup({
    id: "workspace-backlog",
    variant: "backlog",
    title: "Backlog",
    defaultFilter: "all-outstanding",
    pageSize: 8,
    tabs: [
      ["All Outstanding", activeBacklogItems.length, "all-outstanding"],
      ["Outstanding", backlogRows.filter((item) => item.effectiveStatus === "Outstanding").length, "outstanding"],
      ["Approved", backlogRows.filter((item) => item.effectiveStatus === "Approved").length, "approved"],
      ["In progress", backlogRows.filter((item) => item.effectiveStatus === "In progress").length, "in-progress"],
      ["Unassessed", backlogRows.filter((item) => item.effectiveStatus === "Unassessed").length, "unassessed"],
      ["Implemented", backlogRows.filter((item) => item.effectiveStatus === "Implemented").length, "implemented"],
      ["Signed off", backlogRows.filter((item) => item.effectiveStatus === "Signed off").length, "signed-off"],
      ["Cancelled", backlogRows.filter((item) => item.effectiveStatus === "Cancelled").length, "cancelled"],
      ["High", backlogRows.filter((item) => item.priority === "High").length, "high"],
      ["Medium", backlogRows.filter((item) => item.priority === "Medium").length, "medium"],
      ["Low", backlogRows.filter((item) => item.priority === "Low").length, "low"],
      ["Human", backlogRows.filter((item) => item.source === "Human").length, "human"],
      ["Codex", backlogRows.filter((item) => item.source === "Codex").length, "codex"]
    ],
    columns: ["Pick", "Cancel", "#", "Status", "Priority", "Effort", "Source", "Area", "Backlog item"],
    rows: backlogRows.map((item) => ({
      href: "#ai-backlog",
      targetId: `backlog-${item.id}`,
      status: item.effectiveStatus,
      tone: item.priority,
      filter: `${!["Implemented", "Signed off", "Cancelled"].includes(item.effectiveStatus) ? "all-outstanding " : ""}${slugId(item.effectiveStatus)} ${slugId(item.source)} ${slugId(item.priority)} ${slugId(item.effort)}`,
      cells: [
        { type: "html", html: backlogPickupMarkup(item), search: "" },
        { type: "html", html: backlogCancelMarkup(item), search: "" },
        item.id,
        { type: "status", text: item.effectiveStatus },
        { type: "impact", text: item.priority || "Unassessed" },
        { type: "effort", text: item.effort },
        item.source,
        item.area,
        backlogItemSummary(item)
      ]
    }))
  })}
  `;
}

function backlogPickupMarkup(item) {
  if (["Implemented", "Approved", "Signed off", "Cancelled"].includes(item.effectiveStatus)) return "";
  const checked = item.effectiveStatus === "In progress";
  const disabled = item.effectiveStatus === "In progress";
  return `
    <label class="backlog-pickup ${disabled ? "is-locked" : ""}" data-backlog-pickup="${escapeHtml(item.id)}" aria-label="Pick up backlog item ${escapeHtml(item.id)}">
      <input type="checkbox" data-backlog-pickup="${escapeHtml(item.id)}" ${checked ? "checked" : ""} ${disabled ? "disabled" : ""}>
      <span></span>
    </label>
  `;
}

function backlogCancelMarkup(item) {
  if (["Implemented", "Signed off", "Cancelled"].includes(item.effectiveStatus)) return "";
  return `
    <button class="backlog-cancel-button" type="button" data-backlog-cancel="${escapeHtml(item.id)}" aria-label="Cancel backlog item ${escapeHtml(item.id)}">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M8 6V4.6c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6V6h3.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1H4.9c-.6 0-1.1-.5-1.1-1.1S4.3 6 4.9 6H8Zm2.2 0h3.6v-.8h-3.6V6Zm-3.6 4c0-.6.5-1.1 1.1-1.1h8.6c.6 0 1.1.5 1.1 1.1v8.2c0 1.5-1.2 2.8-2.8 2.8H9.4c-1.5 0-2.8-1.2-2.8-2.8V10Zm2.2 1.1v7.1c0 .3.3.6.6.6h5.2c.3 0 .6-.3.6-.6v-7.1H8.8Zm2.2 1.2c.5 0 .9.4.9.9v3.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-3.8c0-.5.4-.9.9-.9Zm3 0c.5 0 .9.4.9.9v3.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-3.8c0-.5.4-.9.9-.9Z" fill="currentColor"/>
      </svg>
    </button>
  `;
}

function trashIconMarkup() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 6V4.6c0-.9.7-1.6 1.6-1.6h4.8c.9 0 1.6.7 1.6 1.6V6h3.1c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1H4.9c-.6 0-1.1-.5-1.1-1.1S4.3 6 4.9 6H8Zm2.2 0h3.6v-.8h-3.6V6Zm-3.6 4c0-.6.5-1.1 1.1-1.1h8.6c.6 0 1.1.5 1.1 1.1v8.2c0 1.5-1.2 2.8-2.8 2.8H9.4c-1.5 0-2.8-1.2-2.8-2.8V10Zm2.2 1.1v7.1c0 .3.3.6.6.6h5.2c.3 0 .6-.3.6-.6v-7.1H8.8Zm2.2 1.2c.5 0 .9.4.9.9v3.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-3.8c0-.5.4-.9.9-.9Zm3 0c.5 0 .9.4.9.9v3.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9v-3.8c0-.5.4-.9.9-.9Z" fill="currentColor"/>
    </svg>
  `;
}

function backlogQuickAddMarkup() {
  const sourceLabel = workspaceBacklogSourceStatus === "sqlite-api"
    ? "SQLite workspace API"
    : workspaceBacklogSourceStatus === "repository"
      ? "GitHub project data"
      : "built-in fallback";
  const sourceCopy = workspaceBacklogSourceStatus === "sqlite-api"
    ? "New items are saved into the shared workspace database."
    : "New items added here are browser drafts until committed into the shared source.";
  return `
    <section class="backlog-create-panel" data-backlog-create aria-label="Add backlog item">
      <p class="backlog-source-note">Shared backlog source: ${sourceLabel}. ${sourceCopy}</p>
      <label>
        <span>Add backlog item</span>
        <textarea data-backlog-new-item rows="2" placeholder="Describe the work you want added"></textarea>
      </label>
      <div class="backlog-create-actions">
        <button class="button button-blue" type="button" data-backlog-add>Add backlog item</button>
        <button class="button button-ghost backlog-export-button" type="button" data-backlog-export>Export backlog JSON</button>
      </div>
    </section>
  `;
}

function exportBacklogBackup() {
  const payload = {
    product: "Plai",
    exportedAt: new Date().toISOString(),
    source: workspaceBacklogSourceStatus,
    note: "Backlog backup before moving or sharing the workspace. Includes repository/source items plus browser draft review state.",
    items: workspaceBacklogItems().map((item) => ({
      ...item,
      effectiveStatus: effectiveBacklogStatus(item)
    })),
    localState: {
      selectedIds: readBacklogSelection(),
      customItems: readCustomBacklogItems(),
      overrides: readBacklogOverrides(),
      deletedIds: readDeletedBacklogItems()
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `plai-backlog-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function addBacklogItemFromForm(form) {
  if (!form) return;
  const itemInput = form.querySelector("[data-backlog-new-item]");
  const itemText = itemInput?.value.trim();
  if (!itemText) return;
  if (canUseBacklogApi()) {
    createBacklogItemViaApi(itemText)
      .then(() => {
        if (itemInput) itemInput.value = "";
        activePlayAiListFilters["workspace-backlog"] = "unassessed";
        activePlayAiListPages["workspace-backlog"] = 1;
        renderWorkspaceBacklog();
      })
      .catch((error) => {
        console.warn("Shared backlog create failed; keeping this as a browser draft.", error);
        const currentItems = workspaceBacklogItems();
        const item = {
          id: nextBacklogItemId(currentItems),
          area: "Unassessed",
          item: itemText,
          priority: "",
          status: "Unassessed",
          source: "Human",
          effort: ""
        };
        writeCustomBacklogItems([...readCustomBacklogItems(), item]);
        activePlayAiListFilters["workspace-backlog"] = "unassessed";
        activePlayAiListPages["workspace-backlog"] = 1;
        renderWorkspaceBacklog();
      });
    return;
  }
  const currentItems = workspaceBacklogItems();
  const item = {
    id: nextBacklogItemId(currentItems),
    area: "Unassessed",
    item: itemText,
    priority: "",
    status: "Unassessed",
    source: "Human",
    effort: ""
  };
  writeCustomBacklogItems([...readCustomBacklogItems(), item]);
  if (itemInput) itemInput.value = "";
  activePlayAiListFilters["workspace-backlog"] = "unassessed";
  activePlayAiListPages["workspace-backlog"] = 1;
  renderWorkspaceBacklog();
}

function backlogDetailMarkup(targetId) {
  const itemId = String(targetId).replace(/^backlog-/, "");
  const item = workspaceBacklogItems().find((entry) => String(entry.id) === itemId);
  if (!item) {
    return `
      ${detailBackMarkup("ai-backlog", "Backlog")}
      <article class="workspace-detail-card backlog-detail-card">
        <h3>Backlog item not found</h3>
      </article>
    `;
  }
  const effectiveStatus = effectiveBacklogStatus(item);
  const canEdit = !["In progress", "Implemented", "Signed off", "Cancelled"].includes(effectiveStatus);
  const canSignOff = effectiveStatus === "Implemented";
  const editing = activeBacklogEditId === String(item.id) && canEdit;
  const statusOptions = backlogStatusOptions(item, effectiveStatus);
  const detailText = item.detail || "";
  const benefitText = item.benefit || "";
  const implementationText = item.implementationNote || "";
  return `
    <div class="playai-detail-bar backlog-detail-actions">
      <button type="button" data-playai-back="ai-backlog">Back to list</button>
      <div>
        ${canEdit && !editing ? `<button type="button" data-backlog-action="edit" data-backlog-id="${escapeHtml(item.id)}">Edit item</button>` : ""}
        ${editing ? `<button type="button" data-backlog-action="save" data-backlog-id="${escapeHtml(item.id)}">Save</button>` : ""}
        ${canSignOff ? `<button type="button" data-backlog-action="sign-off" data-backlog-id="${escapeHtml(item.id)}">Sign off</button>` : ""}
        ${canEdit ? `<button type="button" data-backlog-action="delete" data-backlog-id="${escapeHtml(item.id)}">Delete</button>` : ""}
        ${!["Implemented", "Signed off", "Cancelled"].includes(effectiveStatus) ? `<button type="button" data-backlog-action="cancel" data-backlog-id="${escapeHtml(item.id)}">Cancel</button>` : ""}
      </div>
    </div>
    <article class="workspace-detail-card backlog-detail-card" id="backlog-${escapeHtml(item.id)}" data-backlog-detail="${escapeHtml(item.id)}" data-editing="${editing ? "true" : "false"}">
      <header>
        <span>Backlog item ${escapeHtml(item.id)}</span>
        <strong ${editing ? "hidden" : ""}>${escapeHtml(item.item)}</strong>
        <textarea data-backlog-edit-field="item" rows="3" ${editing ? "" : "hidden disabled"}>${escapeHtml(item.item)}</textarea>
      </header>
      <dl class="workspace-meta-grid">
        <div><dt>Priority</dt><dd>${backlogEditableMeta("priority", item.priority || "", ["", "High", "Medium", "Low"], editing)}</dd></div>
        <div><dt>Status</dt><dd>${backlogEditableMeta("status", item.status || "Outstanding", statusOptions, editing)}</dd></div>
        <div><dt>Effort</dt><dd>${backlogEditableMeta("effort", item.effort || backlogEffort(item), ["", "Small", "Medium", "Large"], editing)}</dd></div>
        <div><dt>Source</dt><dd>${escapeHtml(item.source || "Human")}</dd></div>
        <div><dt>Area</dt><dd>${escapeHtml(item.area || "Unassessed")}</dd></div>
      </dl>
      <section class="workspace-requirement-panel backlog-notes-panel">
        <label>
          <span>Details</span>
          <textarea data-backlog-edit-field="detail" rows="4" placeholder="Add the implementation detail or product context" ${editing ? "" : "disabled"}>${escapeHtml(detailText)}</textarea>
        </label>
        <label>
          <span>Perceived benefit</span>
          <textarea data-backlog-edit-field="benefit" rows="4" placeholder="Assess the expected benefit, especially for Human-raised items" ${editing ? "" : "disabled"}>${escapeHtml(benefitText)}</textarea>
        </label>
      </section>
      <section class="workspace-requirement-panel backlog-implementation-panel">
        <label>
          <span>Implementation record</span>
          <textarea data-backlog-edit-field="implementationNote" rows="4" placeholder="When implemented, capture what changed and any verification notes." ${editing ? "" : "disabled"}>${escapeHtml(implementationText)}</textarea>
        </label>
      </section>
      ${backlogAuditTrailMarkup(item)}
    </article>
  `;
}

function backlogStatusOptions(item, effectiveStatus) {
  const implementationStatuses = ["In progress", "Implemented"];
  if (effectiveStatus === "Approved" || implementationStatuses.includes(item.status)) {
    return ["Unassessed", "Outstanding", "In progress", "Implemented", "Cancelled"];
  }
  return ["Unassessed", "Outstanding", "Cancelled"];
}

function backlogAuditTrailMarkup(item) {
  const auditTrail = normaliseBacklogAuditTrail(item);
  if (!auditTrail.length) {
    return `
      <section class="workspace-requirement-panel backlog-audit-panel">
        <h4>Audit trail</h4>
        <p>No status changes have been recorded yet.</p>
      </section>
    `;
  }
  return `
    <section class="workspace-requirement-panel backlog-audit-panel">
      <h4>Audit trail</h4>
      <ol>
        ${auditTrail.map((entry) => `
          <li>
            <strong>${escapeHtml(entry.action || "Status changed")}</strong>
            <span>${escapeHtml(entry.at || "")} · ${escapeHtml(entry.actor || "System")}</span>
            ${entry.fromStatus || entry.toStatus ? `<em>${escapeHtml(entry.fromStatus || "None")} → ${escapeHtml(entry.toStatus || "None")}</em>` : ""}
            ${entry.note ? `<p>${escapeHtml(entry.note)}</p>` : ""}
          </li>
        `).join("")}
      </ol>
    </section>
  `;
}

function backlogEditableMeta(name, value, options, editing) {
  if (!editing) return backlogMetaBadge(name, value || "Unassessed");
  return `
    <select data-backlog-edit-field="${escapeHtml(name)}">
      ${options.map((option) => `<option value="${escapeHtml(option)}" ${option === value ? "selected" : ""}>${escapeHtml(option || "Unassessed")}</option>`).join("")}
    </select>
  `;
}

function backlogMetaBadge(name, value) {
  const safeValue = value || "Unassessed";
  if (name === "priority" && /^(high|medium|low)$/i.test(safeValue)) {
    return `<strong class="list-impact-badge is-${escapeHtml(slugId(safeValue))}">${escapeHtml(safeValue)}</strong>`;
  }
  if (name === "status") {
    return `<strong class="list-status-badge is-${escapeHtml(slugId(safeValue))}">${escapeHtml(safeValue)}</strong>`;
  }
  if (name === "effort") {
    return `<strong class="list-effort-badge is-${escapeHtml(slugId(safeValue))}">${escapeHtml(safeValue)}</strong>`;
  }
  return `<strong class="list-status-badge is-unassessed">${escapeHtml(safeValue)}</strong>`;
}

function renderBacklogDetailMode() {
  renderWorkspaceBacklog();
}

function handleBacklogDetailAction(button) {
  const itemId = button.dataset.backlogId;
  const action = button.dataset.backlogAction;
  if (!itemId || !action) return;
  if (action === "edit") {
    activeBacklogEditId = String(itemId);
    renderWorkspaceBacklog();
    return;
  }
  if (action === "delete") {
    deleteBacklogItem(itemId);
    activeBacklogEditId = "";
    activePlayAiDetails["ai-backlog"] = "";
    renderWorkspaceBacklog();
    return;
  }
  if (action === "cancel") {
    updateBacklogItem(itemId, { status: "Cancelled" });
    setBacklogItemSelected(itemId, false);
    activeBacklogEditId = "";
    activePlayAiDetails["ai-backlog"] = "";
    renderWorkspaceBacklog();
    return;
  }
  if (action === "sign-off") {
    updateBacklogItem(itemId, { status: "Signed off" });
    setBacklogItemSelected(itemId, false);
    activeBacklogEditId = "";
    activePlayAiDetails["ai-backlog"] = `backlog-${itemId}`;
    renderWorkspaceBacklog();
    return;
  }
  if (action !== "save") return;
  const card = Array.from(document.querySelectorAll("[data-backlog-detail]")).find((detail) => detail.dataset.backlogDetail === String(itemId));
  const nextItem = {};
  card?.querySelectorAll("[data-backlog-edit-field]").forEach((field) => {
    nextItem[field.dataset.backlogEditField] = field.value.trim();
  });
  if (!nextItem.item) return;
  updateBacklogItem(itemId, nextItem);
  activeBacklogEditId = "";
  activePlayAiDetails["ai-backlog"] = `backlog-${itemId}`;
  renderWorkspaceBacklog();
}

function effectiveBacklogStatus(item) {
  if (["Implemented", "In progress", "Signed off", "Cancelled"].includes(item.status)) return item.status;
  if (isBacklogItemSelected(item)) return "Approved";
  return item.status || "Outstanding";
}

function backlogEffort(item) {
  if (item.effort) return item.effort;
  if (!item.priority || item.status === "Unassessed") return "Unassessed";
  if (item.priority === "High") return "Medium";
  if (item.priority === "Low") return "Small";
  return "Medium";
}

function backlogItemSummary(item) {
  const parts = [item.item];
  if (item.benefit) {
    parts.push(`Benefit: ${item.benefit}`);
  }
  if (item.detail) {
    parts.push(item.detail);
  }
  return parts.join(" ");
}

function renderMarketPage() {
  if (!marketSummaryNode || !marketDetailNode) return;
  marketSummaryNode.innerHTML = `
    ${savedWorkspaceViewsMarkup()}
    ${playAiListPanelMarkup({
    id: "markets",
    title: "Market register",
    defaultFilter: "all",
    tabs: [
      ["All", PLAYAI_MARKETS.length, "all"],
      ["Active", PLAYAI_MARKETS.filter((market) => market.status === "Active").length, "active"],
    ],
    columns: ["Market", "Region", "Status", "Default brand", "Knowledge", "Source"],
    rows: PLAYAI_MARKETS.map((market) => ({
      href: `#${market.id}`,
      targetId: market.id,
      status: market.status,
      filter: slugId(market.status),
      cells: [market.name, market.region, market.status, market.defaultBrand, `${market.knowledge.length} documents`, market.source]
    }))
  })}
  `;
  marketDetailNode.innerHTML = PLAYAI_MARKETS.map((market) => `
    <article class="workspace-detail-card market-detail-card" id="${escapeHtml(market.id)}" hidden>
      <header>
        <span>Market</span>
        <strong>${escapeHtml(market.name)}</strong>
        <div class="workspace-actions">
          <button class="button button-pink" type="button" data-launch-market="${escapeHtml(market.id)}">Launch site</button>
          <button class="button button-yellow" type="button" data-refresh>Refresh catalogue</button>
        </div>
      </header>
      <p>${escapeHtml(market.detail)}</p>
      <dl class="workspace-meta-grid">
        <div><dt>Region</dt><dd>${escapeHtml(market.region)}</dd></div>
        <div><dt>Regulatory profile</dt><dd>${escapeHtml(market.regulatoryProfile)}</dd></div>
        <div><dt>Catalogue source</dt><dd>${escapeHtml(market.source)}</dd></div>
        <div><dt>Brands</dt><dd>${market.brands.map(escapeHtml).join(", ")}</dd></div>
      </dl>
      <section class="workspace-requirement-panel">
        <h3>Market component settings</h3>
        <p>These settings are owned by the market Knowledge Base. Component screens show the implementation record and editable configuration for the selected market.</p>
        <ul>
          ${market.components.map((component) => `
            <li>
              <strong>${escapeHtml(component.name)}:</strong>
              ${escapeHtml(component.setting)}
              <span>${escapeHtml(component.control)} · ${escapeHtml(component.status)} · ${escapeHtml(component.source)}</span>
            </li>
          `).join("")}
        </ul>
      </section>
      <section class="workspace-requirement-panel">
        <h3>Knowledge coverage</h3>
        <ul>
          ${market.knowledge.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
      ${marketLaunchReadinessMarkup(market)}
    </article>
  `).join("");
  renderMarketDetailMode();
}

function savedWorkspaceViewsMarkup() {
  const views = [
    { label: "Market setup", route: "ai-markets", copy: "Review launch market, catalogue source, component settings and readiness." },
    { label: "Knowledge review", route: "ai-knowledge", copy: "Check requirements, compliance status, locks and prompt output." },
    { label: "Launch readiness", route: "ai-markets", copy: "Open the market detail and review the launch checklist before demo." }
  ];
  return `
    <section class="workspace-saved-views" aria-label="Saved workspace views">
      ${views.map((view) => `
        <a href="#${escapeHtml(view.route)}" data-route-link="${escapeHtml(view.route)}">
          <strong>${escapeHtml(view.label)}</strong>
          <span>${escapeHtml(view.copy)}</span>
        </a>
      `).join("")}
    </section>
  `;
}

function marketLaunchReadinessMarkup(market) {
  const documents = effectiveKnowledgeDocuments();
  const marketDocs = documents.filter((document) => document.market === market.name);
  const nonCompliantCount = marketDocs.filter((document) => isKnowledgeDocumentNonCompliant({
    ...document,
    currentStatus: knowledgeStatus(document)
  })).length;
  const pendingCount = marketDocs.filter((document) => /pending/i.test(knowledgeStatus(document))).length;
  const componentStates = market.components || [];
  const checks = [
    {
      label: "Catalogue source",
      status: market.source ? "Ready" : "Action needed",
      detail: market.source ? `${market.source} configured for game metadata and images.` : "No catalogue source has been set."
    },
    {
      label: "Knowledge coverage",
      status: nonCompliantCount ? "Action needed" : "Ready",
      detail: nonCompliantCount ? `${nonCompliantCount} compliance-sensitive document needs attention.` : `${marketDocs.length} Knowledge documents are available for this market.`
    },
    {
      label: "Pending implementation",
      status: pendingCount ? "Review" : "Ready",
      detail: pendingCount ? `${pendingCount} Knowledge document is still pending implementation.` : "No market Knowledge documents are pending implementation."
    },
    {
      label: "Component settings",
      status: componentStates.some((component) => /pending/i.test(component.status || "")) ? "Review" : "Ready",
      detail: componentStates.map((component) => `${component.name}: ${component.setting}`).join(" · ")
    },
    {
      label: "Brand set",
      status: market.defaultBrand && market.brands?.includes(market.defaultBrand) ? "Ready" : "Action needed",
      detail: `${market.defaultBrand || "No default brand"} selected from ${market.brands?.length || 0} available brands.`
    }
  ];
  return `
    <section class="workspace-requirement-panel launch-readiness-panel">
      <h3>Launch-readiness checklist</h3>
      <ul>
        ${checks.map((check) => `
          <li>
            <strong>${escapeHtml(check.label)}</strong>
            <span class="list-status-badge is-${escapeHtml(slugId(check.status))}">${escapeHtml(check.status)}</span>
            <small>${escapeHtml(check.detail)}</small>
          </li>
        `).join("")}
      </ul>
    </section>
  `;
}

function renderMarketDetailMode() {
  const page = document.querySelector('[data-page="ai-markets"]');
  if (!page || !marketDetailNode) return;
  const activeId = activePlayAiDetails["ai-markets"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-market-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  marketDetailNode.querySelectorAll(".market-detail-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    marketDetailNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-markets", "Market detail"));
  }
}

function renderKnowledgePage() {
  if (!knowledgeSummaryNode || !knowledgeDetailNode) return;
  const documents = effectiveKnowledgeDocuments().map((document) => ({
    ...document,
    currentStatus: knowledgeStatus(document)
  }));
  const annotatedDocuments = documents.map((document) => ({
    ...document,
    nonCompliant: isKnowledgeDocumentNonCompliant(document)
  }));
  knowledgeSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "knowledge",
    title: "Knowledge documents",
    defaultFilter: "all",
    tabs: [
      ["All", annotatedDocuments.length, "all"],
      ["Non-compliant", annotatedDocuments.filter((document) => document.nonCompliant).length, "non-compliant"],
      ["Pending", annotatedDocuments.filter((document) => /pending/i.test(document.currentStatus)).length, "pending"],
      ["Implemented", annotatedDocuments.filter((document) => /implemented|active/i.test(document.currentStatus)).length, "implemented"],
    ],
    columns: ["Document", "Area", "Owner", "Status", "Compliance", "Market", "Requirements"],
    rows: annotatedDocuments.map((document) => ({
      href: `#${document.id}`,
      targetId: document.id,
      status: document.currentStatus,
      filter: `${/pending/i.test(document.currentStatus) ? "pending" : "implemented"} ${document.nonCompliant ? "non-compliant" : "compliant"} ${slugId(document.area)}`,
      cells: [
        document.title,
        document.area,
        document.owner,
        { type: "status", text: document.currentStatus },
        document.nonCompliant ? { type: "status", text: "Action needed" } : { type: "status", text: "Compliant" },
        document.market,
        `${document.requirements.length} rules`
      ]
    }))
  });
  knowledgeDetailNode.innerHTML = annotatedDocuments.map((document) => {
    const editing = activeKnowledgeEditId === document.id;
    return `
    <article class="workspace-detail-card knowledge-document-card" id="${escapeHtml(document.id)}" data-knowledge-document="${escapeHtml(document.id)}" hidden>
      <header>
        <span>${escapeHtml(document.area)}</span>
        <strong>${escapeHtml(document.title)}</strong>
        <em class="knowledge-status is-${escapeHtml(slugId(document.currentStatus))}">${escapeHtml(document.currentStatus)}</em>
        <div class="workspace-actions knowledge-edit-actions">
          ${editing ? `
            <button class="button button-blue" type="button" data-knowledge-action="save" data-knowledge-id="${escapeHtml(document.id)}">Save</button>
            <button class="button button-ghost" type="button" data-knowledge-action="cancel" data-knowledge-id="${escapeHtml(document.id)}">Cancel</button>
          ` : `
            <button class="button button-blue" type="button" data-knowledge-action="edit" data-knowledge-id="${escapeHtml(document.id)}">Edit requirements</button>
          `}
        </div>
      </header>
      <p>${escapeHtml(document.summary)}</p>
      ${document.nonCompliant ? `
        <section class="workspace-warning-panel">
          <strong>Compliance attention needed</strong>
          <p>This Knowledge document contains mandatory customer-site requirements that are still pending implementation.</p>
        </section>
      ` : ""}
      <section class="workspace-requirement-panel">
        <h3>Requirements</h3>
        <ul class="knowledge-requirement-list">
          ${document.requirements.map((item, index) => {
            const locked = isKnowledgeRequirementLocked(document.id, index);
            const conflict = knowledgeRequirementConflict(document, item);
            return `
              <li class="${locked ? "is-locked" : ""} ${conflict ? "has-conflict" : ""}">
                ${editing ? `
                  <textarea data-knowledge-requirement-field rows="2" ${locked ? "disabled" : ""}>${escapeHtml(item)}</textarea>
                ` : `
                  <span>${escapeHtml(item)}</span>
                `}
                <label class="knowledge-lock-toggle">
                  <input type="checkbox" data-knowledge-lock="${escapeHtml(document.id)}" data-requirement-index="${escapeHtml(index)}" ${locked ? "checked" : ""}>
                  <span>${locked ? "Locked" : "Lock"}</span>
                </label>
                ${editing && !locked ? `
                  <button class="knowledge-row-delete" type="button" data-knowledge-action="delete" data-knowledge-id="${escapeHtml(document.id)}" data-requirement-index="${escapeHtml(index)}" aria-label="Delete requirement">${trashIconMarkup()}</button>
                ` : ""}
                ${conflict ? `<small>Potential conflict with regulatory Knowledge. Accepted for review, but highlighted for attention.</small>` : ""}
              </li>
            `;
          }).join("")}
        </ul>
        ${editing ? `
          <button class="button button-ghost knowledge-add-row" type="button" data-knowledge-action="add" data-knowledge-id="${escapeHtml(document.id)}">Add requirement line</button>
        ` : ""}
      </section>
      <section class="workspace-requirement-panel">
        <h3>Current implementation touchpoints</h3>
        <ul>
          ${document.implementation.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </section>
      ${knowledgePromptDiffMarkup(document)}
      <section class="workspace-prompt-panel">
        <h3>Codex prompt</h3>
        <pre>${escapeHtml(knowledgeDocumentPrompt(document))}</pre>
        <div class="workspace-actions">
          <button class="button button-pink" type="button" data-knowledge-prompt="${escapeHtml(document.id)}">Send prompt to Studio queue</button>
          <button class="button button-yellow" type="button" data-knowledge-status="${escapeHtml(document.id)}" data-status-value="Implemented">Mark implemented</button>
          <button class="button button-ghost" type="button" data-knowledge-status="${escapeHtml(document.id)}" data-status-value="Pending implementation">Mark pending</button>
        </div>
      </section>
    </article>
  `;
  }).join("");
  renderKnowledgeDetailMode();
}

function isKnowledgeDocumentNonCompliant(document) {
  if (!/pending/i.test(document.currentStatus || "")) return false;
  const text = `${document.area} ${document.owner} ${document.summary} ${document.requirements.join(" ")}`.toLowerCase();
  return /compliance|regulat|gdpr|privacy|terms|cookie|consent|18\+|must|required|ukgc|pecr/.test(text);
}

function renderKnowledgeDetailMode() {
  const page = document.querySelector('[data-page="ai-knowledge"]');
  if (!page || !knowledgeDetailNode) return;
  const activeId = activePlayAiDetails["ai-knowledge"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-knowledge-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  knowledgeDetailNode.querySelectorAll(".knowledge-document-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    knowledgeDetailNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-knowledge", "Knowledge detail"));
  }
}

function renderAutomationPage() {
  if (!automationSummaryNode || !automationDetailNode) return;
  const pending = PLAYAI_KNOWLEDGE_DOCUMENTS
    .map((document) => ({ ...document, currentStatus: knowledgeStatus(document) }))
    .filter((document) => /pending/i.test(document.currentStatus));
  automationSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "automation",
    title: "Pending implementation queue",
    defaultFilter: "all",
    tabs: [
      ["All", pending.length, "all"],
      ["Pending", pending.length, "pending"],
    ],
    columns: ["Requirement", "Area", "Market", "Status", "Owner", "Action"],
    rows: pending.map((document) => ({
      href: `#automation-${document.id}`,
      targetId: `automation-${document.id}`,
      status: document.currentStatus,
      filter: "pending",
      cells: [document.title, document.area, document.market, document.currentStatus, document.owner, "Send to Studio"]
    }))
  });
  automationDetailNode.innerHTML = pending.map((document) => `
    <article class="workspace-detail-card knowledge-document-card" id="automation-${escapeHtml(document.id)}" hidden>
      <header>
        <span>Pending</span>
        <strong>${escapeHtml(document.title)}</strong>
      </header>
      <p>${escapeHtml(document.summary)}</p>
      <section class="workspace-prompt-panel">
        <h3>Next Codex prompt</h3>
        <pre>${escapeHtml(document.prompt)}</pre>
        <div class="workspace-actions">
          <button class="button button-pink" type="button" data-knowledge-prompt="${escapeHtml(document.id)}">Send prompt to Studio queue</button>
          <button class="button button-yellow" type="button" data-knowledge-status="${escapeHtml(document.id)}" data-status-value="Implemented">Mark implemented</button>
        </div>
      </section>
    </article>
  `).join("") || `
    <article class="workspace-detail-card">
      <header><span>Clear</span><strong>No pending Knowledge requirements</strong></header>
      <p>All current Knowledge documents are marked implemented or active.</p>
    </article>
  `;
  renderAutomationDetailMode();
}

function renderAutomationDetailMode() {
  const page = document.querySelector('[data-page="ai-automation"]');
  if (!page || !automationDetailNode) return;
  const activeId = activePlayAiDetails["ai-automation"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-automation-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  automationDetailNode.querySelectorAll(".knowledge-document-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    automationDetailNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-automation", "Automation detail"));
  }
}

function selectedBrandId() {
  const saved = localStorage.getItem(AI_BRAND_KEY);
  return SITE_BRANDS.some((brand) => brand.id === saved) ? saved : "bubblegum";
}

function selectedBrand() {
  return SITE_BRANDS.find((brand) => brand.id === selectedBrandId()) || SITE_BRANDS[0];
}

function applySelectedBrand() {
  const brand = selectedBrand();
  document.body.dataset.siteBrand = brand.id;
  document.documentElement.style.setProperty("--brand-primary", brand.tokens.primary);
  document.documentElement.style.setProperty("--brand-primary-deep", brand.tokens.primaryDeep);
  document.documentElement.style.setProperty("--brand-accent", brand.tokens.accent);
  document.documentElement.style.setProperty("--brand-highlight", brand.tokens.highlight);
  document.documentElement.style.setProperty("--brand-panel", brand.tokens.panel);
  document.documentElement.style.setProperty("--brand-surface", brand.tokens.surface);
  applyBrandAssets(brand);
  applyBrandContent(brand);
}

function applyBrandAssets(brand) {
  const markSrc = brand.images?.mark || "assets/impossible-elephant-hero.png";
  const heroSrc = brand.images?.hero || markSrc;
  document.querySelectorAll(".brand-animal img").forEach((img) => {
    img.src = markSrc;
    img.alt = "";
  });
  document.querySelectorAll(".hero-elephant, .login-elephant, .register-brand-panel img").forEach((img) => {
    img.src = heroSrc;
    img.alt = "";
  });
  document.querySelectorAll(".brand-main").forEach((node) => {
    node.textContent = brand.logoText || "Impossible";
  });
  document.querySelectorAll(".brand-ribbon").forEach((node) => {
    node.textContent = brand.ribbonText || "";
    node.hidden = !brand.ribbonText;
  });
}

function setBrandText(selector, lottolandText, defaultText = "") {
  document.querySelectorAll(selector).forEach((node) => {
    if (!node.dataset.brandDefaultText) {
      node.dataset.brandDefaultText = node.textContent.trim() || defaultText;
    }
    node.textContent = selectedBrandId() === "lottoland" ? lottolandText : node.dataset.brandDefaultText;
  });
}

function applyBrandContent() {
  const isLottoland = selectedBrandId() === "lottoland";
  setBrandText('[data-route-link="home"][data-i18n="navHome"]', "Offers");
  setBrandText('[data-route-link="games"][data-i18n="navGames"]', "Casino");
  setBrandText('[data-route-link="lotteries"][data-i18n="navLotteries"]', "Lotto");
  setBrandText(".hero-copy .eyebrow", "Welcome offer", "Offer");
  setBrandText(".hero-copy > h1", "Deposit and Stake £20 to Get 100 Free Spins!", "Today's welcome boost");
  setBrandText(".hero-copy > p:not(.eyebrow)", "Join today and discover a brighter way to play casino, bingo and lotto in one place.", "Pick up a bright welcome offer and start your Impossible Casino journey.");
  setBrandText(".offer-card.is-casino h2", "100 free spins", "50 free spins");
  setBrandText(".offer-card.is-casino p", "Deposit and stake £20 on selected slots to unlock your welcome offer.", "Try selected slots with a bright welcome boost.");
  setBrandText(".offer-card.is-bingo h2", "Bingo welcome bonus", "£10 bingo bonus");
  setBrandText(".offer-card.is-bingo p", "Bag yourself a £10 bingo bonus and settle into friendly rooms.", "Settle into friendly rooms with a little extra sparkle.");
  setBrandText(".offer-card.is-lottery h2", "Lotto made simple", "First line on us");
  setBrandText(".offer-card.is-lottery p", "Pick your numbers and follow every draw from a clean Lotto flow.", "Pick numbers for the next big draw in one smooth flow.");
  setBrandText("#login-title", "Welcome back to Lottoland", "Welcome back to Impossible");
  setBrandText("#register-title", "Create an account", "Create your account");
  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.toggle("is-lottoland-extra", isLottoland && ["help"].includes(link.dataset.routeLink));
  });
}

function selectSiteBrand(brandId) {
  if (!SITE_BRANDS.some((brand) => brand.id === brandId)) return;
  localStorage.setItem(AI_BRAND_KEY, brandId);
  applySelectedBrand();
  renderBrandPage();
  trackUxEvent("Brand Selected", {
    component: "PlayAI Brands",
    brand: SITE_BRANDS.find((brand) => brand.id === brandId)?.name || brandId
  });
}

function renderBrandPage() {
  renderBrandSummary();
  renderBrandDetails();
  renderBrandDetailMode();
}

function renderBrandSummary() {
  if (!brandSummaryNode) return;
  const current = selectedBrandId();
  const rows = SITE_BRANDS.map((brand) => ({
    href: `#brand-${brand.id}`,
    targetId: `brand-${brand.id}`,
    cells: [
      brand.name,
      brand.id === current ? "Selected" : "Available",
      brand.tone,
      brand.assets,
      brand.palette.join(" · ")
    ],
    status: brand.id === current ? "Selected" : "Available",
    filter: brand.id === current ? "selected active" : "available"
  }));
  brandSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "brands",
    title: "Brand register",
    defaultFilter: "all",
    tabs: [
      ["All", SITE_BRANDS.length, "all"],
      ["Selected", 1, "selected"],
      ["Available", SITE_BRANDS.length - 1, "available"],
    ],
    columns: ["Brand", "Status", "Tone", "Assets", "Palette"],
    rows
  });
}

function renderBrandDetails() {
  if (!brandDetailNode) return;
  const current = selectedBrandId();
  brandDetailNode.innerHTML = SITE_BRANDS.map((brand) => brandDetailMarkup(brand, current)).join("");
}

function brandDetailMarkup(brand, current) {
  return `
    <article class="brand-detail-card" id="brand-${escapeHtml(brand.id)}">
      <header>
        <div>
          <span>${brand.id === current ? "Selected brand" : "Brand option"}</span>
          <h3>${escapeHtml(brand.name)}</h3>
          <p>${escapeHtml(brand.description)}</p>
        </div>
        <button class="button ${brand.id === current ? "button-ghost" : "button-yellow"}" type="button" data-ai-action="select-brand" data-brand-id="${escapeHtml(brand.id)}">
          ${brand.id === current ? "Selected" : "Select brand"}
        </button>
      </header>
      <div class="brand-token-strip" aria-label="${escapeHtml(brand.name)} palette">
        ${brand.palette.map((colour) => `<i style="--swatch:${escapeHtml(colour)}"><span>${escapeHtml(colour)}</span></i>`).join("")}
      </div>
      <div class="brand-preview is-${escapeHtml(brand.id)}">
        <div class="brand-preview-header">
          <span class="brand-preview-mark"><img src="${escapeHtml(brand.images?.mark || "assets/impossible-elephant-hero.png")}" alt=""></span>
          <strong>${escapeHtml(brand.logoText || brand.name)}</strong>
          <span>Home</span>
          <span>Games</span>
          <button type="button">Join Now</button>
        </div>
        <div class="brand-preview-hero">
          <div>
            <p>${escapeHtml(brand.tone)}</p>
            <h4>${escapeHtml(brand.name)}</h4>
            <small>${escapeHtml(brand.assetStrategy)}</small>
          </div>
          <img src="${escapeHtml(brand.images?.hero || brand.images?.mark || "assets/impossible-elephant-hero.png")}" alt="">
        </div>
      </div>
      <dl class="brand-detail-meta">
        <div><dt>Primary</dt><dd>${escapeHtml(brand.tokens.primary)}</dd></div>
        <div><dt>Accent</dt><dd>${escapeHtml(brand.tokens.accent)}</dd></div>
        <div><dt>Highlight</dt><dd>${escapeHtml(brand.tokens.highlight)}</dd></div>
        <div><dt>Surface</dt><dd>${escapeHtml(brand.tokens.surface)}</dd></div>
      </dl>
    </article>
  `;
}

function renderBrandDetailMode() {
  const page = document.querySelector('[data-page="ai-brands"]');
  if (!page || !brandDetailNode) return;
  const activeId = activePlayAiDetails["ai-brands"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-brand-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  brandDetailNode.querySelectorAll(".brand-detail-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    brandDetailNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-brands", "Brand detail"));
  }
}

function renderWidgetDetailMode() {
  const page = document.querySelector('[data-page="ai-widgets"]');
  if (!page) return;
  const activeId = activePlayAiDetails["ai-widgets"];
  renderWidgetPreview();
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-widget-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  page.querySelectorAll(".widgets-layout > article").forEach((article) => {
    const belongsToPreview = Boolean(activeId) && article.id === "widget-preview";
    article.hidden = !activeId || (article.id !== activeId && !belongsToPreview);
  });
  if (activeId) {
    const title = document.getElementById(activeId)?.querySelector("header strong")?.textContent?.trim() || "Widget detail";
    page.querySelector(".widgets-layout")?.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-widgets", title));
  }
}

function renderAnalyticsDetailMode() {
  const page = document.querySelector('[data-page="analytics"]');
  if (!page || !analyticsDashboardNode) return;
  const activeId = activePlayAiDetails.analytics;
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-analytics-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  page.querySelector(".analytics-dashboard-builder")?.toggleAttribute("hidden", Boolean(activeId));
  analyticsFilterBarNode?.toggleAttribute("hidden", !Boolean(activeId) || activeId === "dashboard-new");
  analyticsDashboardNode.querySelectorAll(".analytics-dashboard-panel").forEach((panel) => {
    panel.hidden = !activeId || panel.id !== activeId;
  });
  if (activeId) {
    const title = activeId === "dashboard-new"
      ? "Create dashboard"
      : document.getElementById(activeId)?.dataset.dashboardTitle || "Dashboard detail";
    analyticsDashboardNode.insertAdjacentHTML("beforebegin", detailBackMarkup("analytics", title));
  }
}

function openNewDashboardDetail() {
  activePlayAiDetails.analytics = "dashboard-new";
  renderAnalyticsDashboard();
}

function readCustomDashboards() {
  try {
    return JSON.parse(localStorage.getItem(AI_DASHBOARDS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeCustomDashboards(dashboards) {
  localStorage.setItem(AI_DASHBOARDS_KEY, JSON.stringify(dashboards));
}

function readDashboardTitles() {
  try {
    return JSON.parse(localStorage.getItem(AI_DASHBOARD_TITLES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeDashboardTitles(titles) {
  localStorage.setItem(AI_DASHBOARD_TITLES_KEY, JSON.stringify(titles));
}

function dashboardTitle(id, fallback) {
  return readDashboardTitles()[id] || fallback;
}

function readDashboardMetricOrder() {
  try {
    return JSON.parse(localStorage.getItem(AI_DASHBOARD_METRIC_ORDER_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeDashboardMetricOrder(order) {
  localStorage.setItem(AI_DASHBOARD_METRIC_ORDER_KEY, JSON.stringify(order));
}

function readPlayAiTitleOverrides() {
  try {
    return JSON.parse(localStorage.getItem(PLAYAI_TITLE_OVERRIDES_KEY) || "{}");
  } catch {
    return {};
  }
}

function writePlayAiTitleOverrides(overrides) {
  localStorage.setItem(PLAYAI_TITLE_OVERRIDES_KEY, JSON.stringify(overrides));
}

function playAiTitle(titleId, fallback) {
  return readPlayAiTitleOverrides()[titleId] || fallback;
}

function syncPlayAiTitleEditors() {
  document.querySelectorAll("[data-playai-title-id]").forEach((editor) => {
    const titleId = editor.dataset.playaiTitleId;
    const display = editor.querySelector("[data-playai-title-display]");
    const input = editor.querySelector("[data-playai-title-input]");
    const fallback = display?.textContent?.trim() || input?.value || "";
    const title = playAiTitle(titleId, fallback);
    if (display) display.textContent = title;
    if (input) input.value = title;
  });
}

function editablePlayAiTitleMarkup(titleId, title, heading = "h3") {
  const safeHeading = /^h[1-6]$/.test(heading) ? heading : "h3";
  const currentTitle = playAiTitle(titleId, title);
  return `
    <div class="playai-title-editor" data-playai-title-id="${escapeHtml(titleId)}">
      <${safeHeading} data-playai-title-display>${escapeHtml(currentTitle)}</${safeHeading}>
      <input type="text" data-playai-title-input value="${escapeHtml(currentTitle)}" hidden>
    </div>
  `;
}

function syncConfigTitleEditor(card, editing) {
  const editor = card?.querySelector("[data-playai-title-id]");
  if (!editor) return;
  const titleId = editor.dataset.playaiTitleId;
  const display = editor.querySelector("[data-playai-title-display]");
  const input = editor.querySelector("[data-playai-title-input]");
  if (!titleId || !display || !input) return;
  const title = playAiTitle(titleId, display.textContent.trim() || input.value || "");
  display.textContent = title;
  input.value = title;
  display.hidden = editing;
  input.hidden = !editing;
  input.disabled = !editing;
}

function savePlayAiTitleFromCard(card) {
  const editor = card?.querySelector("[data-playai-title-id]");
  const titleId = editor?.dataset.playaiTitleId;
  const input = editor?.querySelector("[data-playai-title-input]");
  const title = input?.value.trim();
  if (!titleId || !title) return;
  const overrides = readPlayAiTitleOverrides();
  overrides[titleId] = title;
  writePlayAiTitleOverrides(overrides);
  syncPlayAiTitleEditors();
}

function isDashboardEditing(dashboardId) {
  return Boolean(dashboardEditMode[dashboardId]);
}

function orderedDashboardMetrics(dashboardId, metrics) {
  const order = readDashboardMetricOrder()[dashboardId] || metrics.map((metric) => metric.id);
  return metrics
    .map((metric, index) => ({ ...metric, fallbackIndex: index }))
    .sort((a, b) => {
      const aIndex = order.indexOf(a.id);
      const bIndex = order.indexOf(b.id);
      return (aIndex === -1 ? a.fallbackIndex + order.length : aIndex) -
        (bIndex === -1 ? b.fallbackIndex + order.length : bIndex);
    });
}

function saveDashboardMetricOrder(dashboardId, metricIds) {
  const order = readDashboardMetricOrder();
  order[dashboardId] = metricIds;
  writeDashboardMetricOrder(order);
}

function dashboardMetricsMarkup(dashboardId, metrics) {
  const editing = isDashboardEditing(dashboardId);
  return `
    <div class="analytics-metrics${editing ? " is-editing" : ""}" data-dashboard-metrics="${escapeHtml(dashboardId)}">
      ${orderedDashboardMetrics(dashboardId, metrics)
        .map((metric) => metricCard(metric.label, metric.value, metric.id, dashboardId, editing))
        .join("")}
    </div>
  `;
}

function saveCustomDashboard() {
  const title = document.querySelector('[data-dashboard-field="title"]')?.value.trim();
  const label = document.querySelector('[data-dashboard-field="label"]')?.value.trim();
  if (!title) return;
  const dashboard = {
    id: `dashboard-custom-${Date.now()}`,
    title,
    label: label || "Custom",
    createdAt: new Date().toISOString()
  };
  writeCustomDashboards([...readCustomDashboards(), dashboard]);
  activePlayAiDetails.analytics = dashboard.id;
  renderAnalyticsDashboard();
  trackUxEvent("AI Dashboard Created", { title: dashboard.title, label: dashboard.label });
}

function renderSuggestionDetailMode() {
  const page = document.querySelector('[data-page="ai-suggestions"]');
  if (!page || !suggestionListNode) return;
  const activeId = activePlayAiDetails["ai-suggestions"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-suggestion-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  suggestionListNode.querySelectorAll(".suggestion-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    const title = document.getElementById(activeId)?.querySelector("h3")?.textContent?.trim() || "Recommendation detail";
    suggestionListNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-suggestions", title));
  }
}

function renderExperimentDetailMode() {
  const page = document.querySelector('[data-page="ai-experiment"]');
  if (!page || !experimentDashboardNode) return;
  const activeId = activePlayAiDetails["ai-experiment"];
  page.classList.toggle("is-detail-open", Boolean(activeId));
  page.querySelector(".playai-detail-bar")?.remove();
  page.querySelector("[data-experiment-summary]")?.toggleAttribute("hidden", Boolean(activeId));
  const dependencyMap = page.querySelector("[data-experiment-map]");
  if (dependencyMap) dependencyMap.hidden = true;
  experimentDashboardNode.querySelectorAll(".experiment-card").forEach((card) => {
    card.hidden = !activeId || card.id !== activeId;
  });
  if (activeId) {
    const title = document.getElementById(activeId)?.querySelector("h3")?.textContent?.trim() || "Experiment detail";
    experimentDashboardNode.insertAdjacentHTML("beforebegin", detailBackMarkup("ai-experiment", title));
  }
}

function featureStateFromControls() {
  const existing = readWidgetState();
  return {
    ...existing,
    featureSwitches: {
      ...existing.featureSwitches,
      depositLimits: {
        enabled: Boolean(document.querySelector('[data-feature-field="deposit-limits-enabled"]')?.checked),
        market: document.querySelector('[data-feature-field="deposit-limits-market"]')?.value || "uk",
        period: document.querySelector('[data-feature-field="deposit-limits-period"]')?.value || "weekly"
      }
    }
  };
}

function handleFeatureSwitchChange(event) {
  if (!event.target.closest("[data-feature-field]")) return;
  const card = event.target.closest(".widget-config-card");
  if (!card || !isConfigCardEditing(card)) return;
  setConfigStatus(card, "Unsaved changes", "dirty");
  renderFeaturePreview();
}

function renderFeaturePreview() {
  if (!featurePreviewNode) return;
  featurePreviewNode.innerHTML = "";
}

function renderWidgetSummary() {
  if (!widgetSummaryNode) return;
  const state = readWidgetState();
  const banner = state.serviceBanner || defaultWidgetState().serviceBanner;
  const lotteryHelper = state.lotteryHelper || defaultWidgetState().lotteryHelper;
  const depositLimits = state.featureSwitches?.depositLimits || defaultWidgetState().featureSwitches.depositLimits;
  const items = [
    {
      href: "#widget-service-banner",
      name: playAiTitle("widget-service-banner", "Top of site notice"),
      type: "Implementation record",
      location: "Above main navigation",
      status: banner.enabled ? "Active" : "Off",
      owner: "Market Knowledge",
      detail: banner.enabled ? `${banner.tone} tone` : "Hidden"
    },
    {
      href: "#widget-lottery-helper",
      name: playAiTitle("widget-lottery-helper", "Guided ticket popup"),
      type: "Implementation record",
      location: "Lotteries",
      status: lotteryHelper.enabled ? "Active" : "Off",
      owner: "Lottery guide Knowledge",
      detail: lotteryHelper.displayMode === "always" ? "Always show" : "Show once"
    },
    {
      href: "#feature-deposit-limits",
      name: playAiTitle("feature-deposit-limits", "Post-registration limits"),
      type: "Feature switch",
      location: "Post-registration",
      status: depositLimits.enabled && depositLimits.market !== "off" ? "Active" : "Off",
      owner: "Deposit limits Knowledge",
      detail: `${depositLimits.market} · ${depositLimits.period}`
    }
  ];
  widgetSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "widgets",
    title: "Widget and feature inventory",
    defaultFilter: "all",
    tabs: [
      ["All", items.length, "all"],
      ["Active", items.filter((item) => item.status === "Active").length, "active"],
      ["Off", items.filter((item) => item.status === "Off").length, "off"]
    ],
    columns: ["Name", "Type", "Location", "Owner", "Status", "Detail"],
    rows: items.map((item) => ({
      href: item.href,
      targetId: item.href.replace(/^#/, ""),
      cells: [item.name, item.type, item.location, item.owner, item.status, item.detail],
      status: item.status,
      filter: slugId(item.status)
    }))
  });
  renderWidgetDetailMode();
}

function depositLimitComponentMarkup(config, preview = false) {
  const period = config.period || "weekly";
  const marketCopy =
    config.market === "uk"
      ? "UK journey: invite customers to choose a limit before they continue."
      : "Optional market journey: present limits as a helpful choice without blocking progress.";
  return `
    <section class="deposit-limit-component${preview ? " is-preview" : ""}">
      <span>${preview ? "Post-registration preview" : "Safer play"}</span>
      <h4>Set a ${escapeHtml(period)} deposit limit</h4>
      <p>${escapeHtml(marketCopy)}</p>
      <div class="deposit-limit-options">
        ${["£10", "£25", "£50", "Custom"].map((amount) => `<button type="button" data-deposit-limit="${escapeHtml(amount)}">${amount}</button>`).join("")}
      </div>
      <label class="deposit-limit-custom" data-deposit-limit-custom hidden>
        <span>Custom limit</span>
        <input type="number" min="1" step="1" inputmode="decimal" placeholder="Enter amount in £">
      </label>
      <button class="button button-yellow" type="button" data-deposit-limit-save>Save limit</button>
    </section>
  `;
}

function renderWidgets() {
  const state = readWidgetState();
  const banner = state.serviceBanner || defaultWidgetState().serviceBanner;
  const route = normaliseRoute(location.hash);
  const isPlayAiRoute = PLAYAI_ROUTES.has(route);
  document.querySelectorAll("[data-widget-slot]").forEach((slot) => {
    slot.replaceChildren();
    slot.hidden = true;
  });
  document.querySelectorAll("[data-lottery-helper-widget]").forEach((widget) => widget.remove());

  if (isPlayAiRoute) {
    lastWidgetImpressionKey = "";
    return;
  }

  if (banner.enabled) {
    const slot = document.querySelector(`[data-widget-slot="${CSS.escape(banner.location || "top-nav")}"]`);
    if (slot) {
      slot.hidden = false;
      slot.innerHTML = serviceBannerMarkup(banner);
      const impressionKey = `${route}:service:${banner.location}:${banner.tone}:${banner.message}`;
      if (lastWidgetImpressionKey !== impressionKey) {
        lastWidgetImpressionKey = impressionKey;
        trackUxEvent("Widget Displayed", {
          widget: "Service message banner",
          location: banner.location,
          tone: banner.tone
        });
      }
    }
  }

  renderLotteryHelperWidget(state.lotteryHelper);
}

function renderWidgetPreview() {
  if (!widgetPreviewNode) return;
  const state = widgetStateFromControls();
  const activeId = activePlayAiDetails["ai-widgets"];
  let content = serviceBannerMarkup(state.serviceBanner, true);
  if (activeId === "widget-lottery-helper") {
    content = lotteryHelperMarkup(0, true);
  } else if (activeId === "feature-deposit-limits") {
    const depositLimits =
      featureStateFromControls().featureSwitches?.depositLimits ||
      defaultWidgetState().featureSwitches.depositLimits;
    content = depositLimits.enabled && depositLimits.market !== "off"
      ? depositLimitComponentMarkup(depositLimits, true)
      : `
        <div class="feature-switch-off">
          <strong>Component hidden</strong>
          <p>The deposit-limit prompt will not appear after registration for the current switch state.</p>
        </div>
      `;
  }
  widgetPreviewNode.innerHTML = `
    <div class="site-theme-preview site-theme-preview-component">
      ${content}
    </div>
  `;
}

function serviceBannerMarkup(banner, preview = false) {
  const tone = banner.tone || "notice";
  return `
    <aside class="service-banner is-${escapeHtml(tone)}${preview ? " is-preview" : ""}" aria-label="Service message">
      <span>${escapeHtml(tone === "success" ? "Resolved" : tone === "warning" ? "Important" : "Service update")}</span>
      <p>${escapeHtml(banner.message)}</p>
      ${preview ? "" : `<button type="button" data-widget-dismiss aria-label="Dismiss service message">×</button>`}
    </aside>
  `;
}

function lotteryHelperSteps() {
  return [
    {
      title: "Pick five main numbers",
      copy: "Choose five numbers on any ticket card. Selected numbers glow so it is easy to see when a line is nearly complete."
    },
    {
      title: "Add two stars",
      copy: "Each completed line also needs two stars. The summary updates once a full line is ready."
    },
    {
      title: "Use quick picks",
      copy: "Use the dice on one card, or quick-pick 1, 3 or all cards when you want the ticket filled for you."
    },
    {
      title: "Choose draw days and weeks",
      copy: "Pick Tuesday, Friday or both, choose the number of weeks, then decide whether auto-renew should stay on."
    }
  ];
}

function lotteryHelperMarkup(stepIndex = 0, preview = false) {
  const steps = lotteryHelperSteps();
  const step = steps[stepIndex] || steps[0];
  const progress = `${stepIndex + 1} of ${steps.length}`;
  return `
    <div class="lottery-helper-overlay${preview ? " is-preview" : ""}" data-lottery-helper-widget data-step="${stepIndex}" aria-label="Lottery help">
      <aside class="lottery-helper-widget">
        <div>
          <span>Lottery guide</span>
          <strong>${escapeHtml(step.title)}</strong>
          <p>${escapeHtml(step.copy)}</p>
        </div>
        <footer>
          <small>${escapeHtml(progress)}</small>
          <div>
            <button type="button" data-lottery-helper-action="back" ${stepIndex ? "" : "disabled"}>Back</button>
            <button type="button" data-lottery-helper-action="${stepIndex === steps.length - 1 ? "done" : "next"}">
              ${stepIndex === steps.length - 1 ? "Got it" : "Next"}
            </button>
          </div>
        </footer>
        ${preview ? "" : `<button class="lottery-helper-close" type="button" data-lottery-helper-action="dismiss" aria-label="Dismiss lottery guide">×</button>`}
      </aside>
    </div>
  `;
}

function renderLotteryHelperWidget(config = defaultWidgetState().lotteryHelper) {
  const route = normaliseRoute(location.hash);
  if (route !== "lotteries" || !config?.enabled) return;
  if ((config.displayMode || "once") === "once" && localStorage.getItem(LOTTERY_HELPER_DISMISSED_KEY)) return;
  const lotteryPage = document.querySelector('[data-page="lotteries"]');
  if (!lotteryPage) return;
  lotteryPage.insertAdjacentHTML("afterbegin", lotteryHelperMarkup(0));
  trackUxEvent("Widget Displayed", {
    widget: "Lottery helper",
    location: "lotteries"
  });
}

function handleLotteryHelperAction(button) {
  const widget = button.closest("[data-lottery-helper-widget]");
  if (!widget) return;
  const steps = lotteryHelperSteps();
  const currentStep = Number(widget.dataset.step || 0);
  const action = button.dataset.lotteryHelperAction;

  if (action === "dismiss" || action === "done") {
    const helperConfig = readWidgetState().lotteryHelper || defaultWidgetState().lotteryHelper;
    if ((helperConfig.displayMode || "once") === "once") {
      localStorage.setItem(LOTTERY_HELPER_DISMISSED_KEY, "true");
    }
    widget.remove();
    trackUxEvent("Widget Dismissed", {
      widget: "Lottery helper",
      step: currentStep + 1,
      action
    });
    return;
  }

  const nextStep = action === "back"
    ? Math.max(0, currentStep - 1)
    : Math.min(steps.length - 1, currentStep + 1);
  widget.outerHTML = lotteryHelperMarkup(nextStep);
  trackUxEvent("Widget Step Viewed", {
    widget: "Lottery helper",
    step: nextStep + 1
  });
}

function handleAiUxClick(event) {
  const actionButton = event.target.closest("[data-ai-action]");
  if (!actionButton) return;

  const action = actionButton.dataset.aiAction;
  const suggestionId = actionButton.dataset.suggestionId;

  if (action === "generate") {
    generateSuggestions();
  } else if (action === "approve" || action === "reject") {
    updateSuggestionStatus(suggestionId, action === "approve" ? "approved" : "rejected");
  } else if (action === "apply") {
    applySuggestion(suggestionId);
  } else if (action === "clear-events") {
    window.PlayAILocalAnalytics?.clearEvents();
    generateSuggestions();
  } else if (action === "export-events") {
    downloadTextFile("impossible-events.json", window.PlayAILocalAnalytics?.exportJson() || "[]");
  } else if (action === "reset-segments") {
    writeAnalyticsFilters(defaultAnalyticsFilters());
    syncAnalyticsFilterControls();
    renderAnalyticsDashboard();
  } else if (action === "send-to-studio") {
    createStudioRequestFromSuggestion(suggestionId);
  } else if (action === "create-dashboard") {
    openNewDashboardDetail();
  } else if (action === "save-dashboard") {
    saveCustomDashboard();
  } else if (action === "edit-dashboard") {
    editDashboard(actionButton.dataset.dashboardId);
  } else if (action === "save-dashboard-config") {
    saveDashboardConfig(actionButton.dataset.dashboardId);
  } else if (action === "select-brand") {
    selectSiteBrand(actionButton.dataset.brandId);
  }
}

function editDashboard(dashboardId) {
  const panel = document.getElementById(dashboardId);
  if (!panel) return;
  dashboardEditMode = {
    ...dashboardEditMode,
    [dashboardId]: true
  };
  panel.dataset.editing = "true";
  const display = panel.querySelector("[data-dashboard-title-display]");
  const input = panel.querySelector("[data-dashboard-title-input]");
  const editButton = panel.querySelector('[data-ai-action="edit-dashboard"]');
  const saveButton = panel.querySelector('[data-ai-action="save-dashboard-config"]');
  if (!display || !input) return;
  input.hidden = false;
  input.disabled = false;
  display.hidden = true;
  editButton?.toggleAttribute("hidden", true);
  saveButton?.toggleAttribute("hidden", false);
  panel.querySelectorAll("[data-metric-id]").forEach((metric) => {
    metric.draggable = true;
  });
  panel.querySelector("[data-dashboard-metrics]")?.classList.add("is-editing");
  input.focus();
  input.select();
}

function saveDashboardConfig(dashboardId) {
  const panel = document.getElementById(dashboardId);
  const input = panel?.querySelector("[data-dashboard-title-input]");
  const title = input?.value.trim();
  if (!dashboardId || !title) return;
  const titles = readDashboardTitles();
  titles[dashboardId] = title;
  writeDashboardTitles(titles);
  const customDashboards = readCustomDashboards().map((dashboard) =>
    dashboard.id === dashboardId ? { ...dashboard, title } : dashboard
  );
  writeCustomDashboards(customDashboards);
  dashboardEditMode = {
    ...dashboardEditMode,
    [dashboardId]: false
  };
  activePlayAiDetails.analytics = dashboardId;
  renderAnalyticsDashboard();
  trackUxEvent("AI Dashboard Saved", { dashboardId, title });
}

function handlePrototypeNavigationClick(event) {
  const link = event.target.closest("[data-route-link]");
  if (!link || !link.closest(".prototype-bar")) return;
  const route = link.dataset.routeLink;
  if (route && route in activePlayAiDetails) {
    activePlayAiDetails[route] = "";
  }
  if (route !== "home" && !PLAYAI_ROUTES.has(route)) return;
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, 0);
}

function handlePrimaryNavigationClick(event) {
  const link = event.target.closest("[data-route-link]");
  if (!link || !link.closest(".site-nav")) return;
  trackUxEvent("Primary Navigation Used", {
    route: link.dataset.routeLink,
    label: ROUTE_LABELS[link.dataset.routeLink] || link.dataset.routeLink
  });
  setTimeout(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, 0);
}

function generateSuggestions() {
  const suggestions = window.PlayAISuggestionEngine?.generate(
    window.PlayAILocalAnalytics?.getEvents() || []
  ) || [];
  trackUxEvent("AI Suggestion Generated", {
    suggestionCount: suggestions.length
  });
  renderAiUxViews();
}

function updateSuggestionStatus(suggestionId, status) {
  window.PlayAISuggestionEngine?.updateStatus(suggestionId, status);
  const suggestion = window.PlayAISuggestionEngine
    ?.getSuggestions()
    .find((item) => item.suggestionId === suggestionId);
  trackUxEvent(status === "approved" ? "AI Suggestion Accepted" : "AI Suggestion Rejected", {
    suggestionId,
    title: suggestion?.title
  });
  if (status === "approved" && suggestion) {
    window.PlayAILocalAnalytics?.queueImprovement(suggestion);
  }
  renderAiUxViews();
}

function applySuggestion(suggestionId) {
  const suggestion = window.PlayAISuggestionEngine
    ?.getSuggestions()
    .find((item) => item.suggestionId === suggestionId);
  if (!suggestion) return;

  if (suggestionId === "search-no-results-helper") {
    document.body.classList.add("ux-search-helper");
  } else if (suggestionId === "layout-save-cta") {
    document.body.classList.add("ux-save-prominent");
  } else if (
    suggestionId.startsWith("repeated-click-") ||
    suggestionId.startsWith("group-clarify-what-happens-after-selecting-this-game")
  ) {
    document.body.classList.add("ux-strong-card-actions");
  }

  window.PlayAISuggestionEngine?.updateStatus(suggestionId, "applied");
  window.PlayAILocalAnalytics?.queueImprovement(suggestion);
  trackUxEvent("AI Suggestion Accepted", {
    suggestionId,
    applied: true,
    title: suggestion.title
  });
  renderAiUxViews();
}

function createStudioRequestFromSuggestion(suggestionId) {
  const suggestion = window.PlayAISuggestionEngine
    ?.getSuggestions()
    .find((item) => item.suggestionId === suggestionId);
  if (!suggestion) return;

  const prompt = [
    suggestion.suggestedAction,
    "",
    `Context: ${suggestion.title}`,
    `Evidence: ${suggestion.evidence}`,
    `Affected view: ${suggestion.affectedView || "Unknown"}`,
    `Affected component: ${suggestion.affectedComponent || "Unknown"}`
  ].join("\n");
  const request = createAiStudioRequest("queued", {
    prompt,
    scope: suggestion.affectedView || "site",
    source: "AI UX recommendation",
    context: `Recommendation: ${suggestion.title}`
  });
  if (request) {
    updateSuggestionStatus(suggestionId, "approved");
    updateAiStudioStatus("Recommendation queued for Codex");
  }
}

function defaultAnalyticsFilters() {
  return {
    route: "all",
    family: "all"
  };
}

function readAnalyticsFilters() {
  try {
    return {
      ...defaultAnalyticsFilters(),
      ...JSON.parse(localStorage.getItem(AI_SEGMENTS_KEY) || "{}")
    };
  } catch {
    return defaultAnalyticsFilters();
  }
}

function writeAnalyticsFilters(filters) {
  localStorage.setItem(AI_SEGMENTS_KEY, JSON.stringify(filters));
}

function syncAnalyticsFilterControls() {
  const filters = readAnalyticsFilters();
  document.querySelectorAll("[data-analytics-filter]").forEach((control) => {
    control.value = filters[control.dataset.analyticsFilter] || "all";
  });
}

function handleAnalyticsFilterChange(event) {
  const control = event.target.closest("[data-analytics-filter]");
  if (!control) return;
  const filters = readAnalyticsFilters();
  filters[control.dataset.analyticsFilter] = control.value;
  writeAnalyticsFilters(filters);
  trackUxEvent("AI Intelligence Filter Changed", {
    component: "AI Intelligence",
    filter: control.dataset.analyticsFilter,
    value: control.value
  });
  renderAnalyticsDashboard();
}

function renderAiUxViews() {
  safeRenderPlayAiPanel("Backlog", renderWorkspaceBacklog);
  safeRenderPlayAiPanel("Markets", renderMarketPage);
  safeRenderPlayAiPanel("Knowledge", renderKnowledgePage);
  safeRenderPlayAiPanel("AI UX", renderSuggestionList);
  safeRenderPlayAiPanel("Brands", renderBrandPage);
  safeRenderPlayAiPanel("AI Experiment", renderExperimentDashboard);
  safeRenderPlayAiPanel("AI Intelligence", renderAnalyticsDashboard);
  safeRenderPlayAiPanel("Automation", renderAutomationPage);
}

function safeRenderPlayAiPanel(name, renderer) {
  try {
    renderer();
  } catch (error) {
    console.warn(`${name} render skipped:`, error);
    if (name === "AI Experiment" && experimentDashboardNode) {
      experimentDashboardNode.innerHTML = `
        <article class="empty-state insight-empty">
          <h3>Experiment monitor paused</h3>
          <p>The rest of the site is still available. Clear events or refresh suggestions, then try this panel again.</p>
        </article>
      `;
    }
  }
}

function renderSuggestionList() {
  if (!suggestionListNode) return;
  const suggestions = window.PlayAISuggestionEngine?.getSuggestions() || [];
  renderSuggestionSummary(suggestions);
  if (!suggestions.length) {
    const events = window.PlayAILocalAnalytics?.getEvents() || [];
    const eventSummary = countBy(events, (event) => event.eventName)
      .slice(0, 6)
      .map(([name, count]) => `${escapeHtml(name)} (${count})`)
      .join(", ");
    suggestionListNode.innerHTML = `
      <article class="empty-state insight-empty">
        <h3>No suggestions yet</h3>
        <p>${events.length} events captured${eventSummary ? `: ${eventSummary}` : "."}</p>
        <p>Try selecting the same game twice, creating a no-result search, or previewing a lobby without saving.</p>
      </article>
    `;
    return;
  }

  suggestionListNode.replaceChildren(
    ...suggestions.map((suggestion) => {
      const card = document.createElement("article");
      card.className = `suggestion-card is-${suggestion.status}`;
      card.id = `suggestion-${suggestion.suggestionId}`;
      card.innerHTML = `
        <div class="suggestion-content">
          <header>
            <span class="severity-badge is-${escapeHtml(suggestion.severity)}">${escapeHtml(suggestion.severity)}</span>
            <strong class="status-badge is-${escapeHtml(suggestion.status)}">${escapeHtml(suggestion.status)}</strong>
          </header>
          ${editablePlayAiTitleMarkup(`suggestion-${suggestion.suggestionId}`, suggestion.title, "h3")}
          <p>${escapeHtml(suggestion.description)}</p>
          <dl>
            <div><dt>Evidence</dt><dd>${escapeHtml(suggestion.evidence)}</dd></div>
            <div><dt>View</dt><dd>${escapeHtml(suggestion.affectedView || "Unknown")}</dd></div>
            <div><dt>Component</dt><dd>${escapeHtml(suggestion.affectedComponent || "Unknown")}</dd></div>
            ${
              suggestion.affectedComponents?.length > 1
                ? `<div><dt>Grouped components</dt><dd>${escapeHtml(suggestion.affectedComponents.join(", "))}</dd></div>`
                : ""
            }
            <div><dt>Suggested action</dt><dd>${escapeHtml(suggestion.suggestedAction)}</dd></div>
          </dl>
          <div class="suggestion-actions">
            <button type="button" data-ai-action="approve" data-suggestion-id="${escapeHtml(suggestion.suggestionId)}">Approve</button>
            <button type="button" data-ai-action="reject" data-suggestion-id="${escapeHtml(suggestion.suggestionId)}">Reject</button>
            <button type="button" data-ai-action="apply" data-suggestion-id="${escapeHtml(suggestion.suggestionId)}">Apply safe change</button>
            <button type="button" data-ai-action="send-to-studio" data-suggestion-id="${escapeHtml(suggestion.suggestionId)}">Send to Studio</button>
          </div>
        </div>
        ${suggestionPreviewMarkup(suggestion)}
      `;
      return card;
    })
  );
}

function renderSuggestionSummary(suggestions) {
  if (!suggestionSummaryNode) return;
  if (!suggestions.length) {
    suggestionSummaryNode.innerHTML = "";
    return;
  }
  suggestionSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "suggestions",
    title: "Recommendation queue",
    defaultFilter: "all",
    tabs: [
      ["All", suggestions.length, "all"],
      ["Pending", suggestions.filter((item) => item.status === "pending").length, "pending"],
      ["Accepted", suggestions.filter((item) => item.status === "approved" || item.status === "applied").length, "accepted"],
      ["Rejected", suggestions.filter((item) => item.status === "rejected").length, "rejected"]
    ],
    columns: ["Recommendation", "Severity", "Status", "View", "Component", "Evidence"],
    rows: suggestions.map((suggestion) => ({
      href: `#suggestion-${suggestion.suggestionId}`,
      targetId: `suggestion-${suggestion.suggestionId}`,
      cells: [
        playAiTitle(`suggestion-${suggestion.suggestionId}`, suggestion.title),
        suggestion.severity,
        suggestion.status,
        suggestion.affectedView || "Unknown",
        suggestion.affectedComponent || "Unknown",
        suggestion.evidence
      ],
      status: suggestion.status,
      tone: suggestion.severity,
      filter: suggestion.status === "approved" || suggestion.status === "applied" ? "accepted" : suggestion.status
    }))
  });
  renderSuggestionDetailMode();
}

function renderAnalyticsDashboard() {
  if (!analyticsDashboardNode) return;
  syncAnalyticsFilterControls();
  const filters = readAnalyticsFilters();
  const events = siteAnalyticsEvents(filters);
  const unfilteredEvents = siteAnalyticsEvents();
  const suggestions = window.PlayAISuggestionEngine?.getSuggestions() || [];
  const navEvents = events.filter((event) => event.eventName === "Primary Navigation Used");
  const viewEvents = events.filter((event) => event.eventName === "View Changed");
  const registrationEvents = events.filter((event) =>
    event.eventName.startsWith("Registration ")
  );
  const loginEvents = events.filter((event) =>
    event.eventName.startsWith("Login ")
  );
  const lotteryDayEvents = events.filter((event) => event.eventName === "Lottery Day Selected");
  const lotteryDurationEvents = events.filter((event) => event.eventName === "Lottery Duration Selected");
  const lotteryQuickPickEvents = events.filter((event) => event.eventName === "Lottery Quick Pick Used");
  const lotteryDiceEvents = events.filter((event) => event.eventName === "Lottery Dice Used");
  const carouselEvents = events.filter((event) => event.eventName === "Carousel Used");
  const selectedGames = countBy(
    events.filter((event) => event.eventName === "Game Selected"),
    (event) => event.properties?.gameName || event.properties?.gameId || "Unknown game"
  );
  const noResultSearches = events.filter((event) => event.eventName === "Search No Results");
  const repeatedClicks = events.filter((event) => event.eventName === "Repeated Click Detected");
  const savedJourneys = events.filter((event) => event.eventName === "Layout Saved");
  const dashboards = analyticsDashboardDefinitions({
    events,
    unfilteredEvents,
    suggestions,
    navEvents,
    viewEvents,
    registrationEvents,
    loginEvents,
    lotteryDayEvents,
    lotteryDurationEvents,
    lotteryQuickPickEvents,
    lotteryDiceEvents,
    carouselEvents,
    selectedGames,
    noResultSearches,
    repeatedClicks,
    savedJourneys,
    filters
  });
  renderAnalyticsSummary(dashboards);

  analyticsDashboardNode.innerHTML = `
    ${dashboards.map((dashboard) => dashboard.markup).join("")}
    ${activePlayAiDetails.analytics === "dashboard-new" ? newDashboardPanelMarkup() : ""}
  `;
  renderAnalyticsDetailMode();
}

function analyticsDashboardDefinitions(data) {
  const {
    events,
    unfilteredEvents,
    suggestions,
    navEvents,
    viewEvents,
    registrationEvents,
    loginEvents,
    lotteryDayEvents,
    lotteryDurationEvents,
    lotteryQuickPickEvents,
    lotteryDiceEvents,
    carouselEvents,
    selectedGames,
    noResultSearches,
    repeatedClicks,
    savedJourneys,
    filters
  } = data;
  const overviewMetrics = [
    { id: "site-events", label: "Site events", value: events.length },
    { id: "nav-clicks", label: "Nav clicks", value: navEvents.length },
    { id: "registration-events", label: "Registration events", value: registrationEvents.length },
    { id: "pending-suggestions", label: "Pending suggestions", value: suggestions.filter((item) => item.status === "pending").length }
  ];
  const dashboards = [
    {
      id: "dashboard-overview",
      title: dashboardTitle("dashboard-overview", "Overview"),
      label: "Core",
      status: "Active",
      events: events.length,
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-overview", dashboardTitle("dashboard-overview", "Overview"), `
        ${segmentSummaryPanel(filters, events.length, unfilteredEvents.length)}
        ${dashboardMetricsMarkup("dashboard-overview", overviewMetrics)}
        ${metricDefinitionsPanel()}
        <div class="analytics-visuals">
          ${pieChartPanel("Primary navigation share", countBy(navEvents, (event) => event.properties?.label || event.properties?.route || "Unknown"))}
          ${barChartPanel("Views by route", countBy(viewEvents, (event) => event.properties?.route || event.route || "home"))}
        </div>
        <section class="event-timeline">
          <h3>Recent event timeline</h3>
          ${events.slice(-18).reverse().map((event) => `
            <article>
              <strong>${escapeHtml(event.eventName)}</strong>
              <span>${formatEventTime(event.timestamp)} · ${escapeHtml(event.route)}</span>
            </article>
          `).join("") || "<p>No events captured yet.</p>"}
        </section>
      `)
    },
    {
      id: "dashboard-registration",
      title: dashboardTitle("dashboard-registration", "Registration"),
      label: "Forms",
      status: "Active",
      events: registrationEvents.length,
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-registration", dashboardTitle("dashboard-registration", "Registration"), `
        <div class="analytics-funnels">
          ${funnelChartPanel("Registration funnel", registrationFunnelRows(registrationEvents))}
        </div>
        ${registrationVariantComparison(registrationEvents)}
      `)
    },
    {
      id: "dashboard-login",
      title: dashboardTitle("dashboard-login", "Login"),
      label: "Forms",
      status: "Active",
      events: loginEvents.length,
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-login", dashboardTitle("dashboard-login", "Login"), `
        <div class="analytics-funnels">
          ${funnelChartPanel("Login funnel", loginFunnelRows(loginEvents))}
        </div>
      `)
    },
    {
      id: "dashboard-games",
      title: dashboardTitle("dashboard-games", "Games and carousels"),
      label: "Content",
      status: "Active",
      events: carouselEvents.length + selectedGames.reduce((sum, row) => sum + row[1], 0),
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-games", dashboardTitle("dashboard-games", "Games and carousels"), `
        <div class="analytics-grid">
          ${barChartPanel("Most selected games", selectedGames.slice(0, 6), "No game selections yet.")}
          ${barChartPanel("Most used carousels", countBy(carouselEvents, (event) => event.properties?.carouselName || event.properties?.carouselId || "Unknown carousel").slice(0, 6), "No carousel usage yet.")}
          ${analyticsPanel("Searches with no results", noResultSearches.slice(-6).map((event) => `${escapeHtml(event.properties?.searchTerm || "Unknown search")} <strong>${formatEventTime(event.timestamp)}</strong>`))}
          ${analyticsPanel("Repeated clicks", repeatedClicks.slice(-6).map((event) => `${escapeHtml(event.properties?.clickKey || "Unknown target")} <strong>${formatEventTime(event.timestamp)}</strong>`))}
        </div>
      `)
    },
    {
      id: "dashboard-lotteries",
      title: dashboardTitle("dashboard-lotteries", "Lotteries"),
      label: "Journey",
      status: "Active",
      events: lotteryDayEvents.length + lotteryDurationEvents.length + lotteryQuickPickEvents.length + lotteryDiceEvents.length,
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-lotteries", dashboardTitle("dashboard-lotteries", "Lotteries"), `
        <div class="analytics-visuals analytics-visuals-lottery">
          ${pieChartPanel("Lottery draw day", countBy(lotteryDayEvents, (event) => lotteryDayLabel(event.properties?.days)))}
          ${pieChartPanel("Lottery duration", countBy(lotteryDurationEvents, (event) => `${event.properties?.weeks || 0} weeks`))}
          ${pieChartPanel("Quick pick usage", countBy(lotteryQuickPickEvents, (event) => quickPickLabel(event.properties?.amount)))}
          ${pieChartPanel("Dice usage", countBy(lotteryDiceEvents, (event) => `Line ${(event.properties?.ticketIndex ?? 0) + 1}`))}
        </div>
      `)
    },
    {
      id: "dashboard-widgets",
      title: dashboardTitle("dashboard-widgets", "Widgets and journeys"),
      label: "Operations",
      status: "Active",
      events: savedJourneys.length,
      updated: "Live",
      markup: analyticsDashboardPanelMarkup("dashboard-widgets", dashboardTitle("dashboard-widgets", "Widgets and journeys"), `
        <div class="analytics-grid">
          ${analyticsPanel("Successful journeys", savedJourneys.slice(-6).map((event) => `${escapeHtml(event.properties?.journey || "layout-save")} <strong>${formatEventTime(event.timestamp)}</strong>`))}
          ${analyticsPanel("Suggestion status", countBy(suggestions, (suggestion) => suggestion.status).map(([status, count]) => `${escapeHtml(status)} <strong>${count}</strong>`))}
        </div>
      `)
    }
  ];
  return dashboards.concat(readCustomDashboards().map((dashboard) => ({
    ...dashboard,
    title: dashboardTitle(dashboard.id, dashboard.title),
    status: "Draft",
    events: 0,
    updated: "Custom",
    markup: analyticsDashboardPanelMarkup(dashboard.id, dashboardTitle(dashboard.id, dashboard.title), `
      <section class="metric-definitions">
        <h3>${escapeHtml(dashboardTitle(dashboard.id, dashboard.title))}</h3>
        <p>This custom dashboard is ready. Add metrics, charts or event families as the reporting need becomes clearer.</p>
      </section>
    `)
  })));
}

function analyticsDashboardPanelMarkup(id, title, content) {
  const editing = isDashboardEditing(id);
  return `
    <section class="analytics-dashboard-panel" id="${escapeHtml(id)}" data-dashboard-title="${escapeHtml(title)}" data-editing="${editing ? "true" : "false"}">
      <header class="dashboard-detail-header">
        <div>
          <span>Dashboard</span>
          <strong data-dashboard-title-display ${editing ? "hidden" : ""}>${escapeHtml(title)}</strong>
          <input type="text" data-dashboard-title-input value="${escapeHtml(title)}" ${editing ? "" : "hidden disabled"}>
        </div>
        <div>
          <button class="button button-yellow" type="button" data-ai-action="edit-dashboard" data-dashboard-id="${escapeHtml(id)}" ${editing ? "hidden" : ""}>Edit dashboard</button>
          <button class="button button-pink" type="button" data-ai-action="save-dashboard-config" data-dashboard-id="${escapeHtml(id)}" ${editing ? "" : "hidden"}>Save dashboard</button>
        </div>
      </header>
      ${content}
    </section>
  `;
}

function renderAnalyticsSummary(dashboards) {
  if (!analyticsSummaryNode) return;
  analyticsSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "analytics",
    title: "Dashboard register",
    defaultFilter: "all",
    tabs: [
      ["All", dashboards.length, "all"],
      ["Active", dashboards.filter((dashboard) => dashboard.status === "Active").length, "active"],
      ["Draft", dashboards.filter((dashboard) => dashboard.status === "Draft").length, "draft"],
    ],
    columns: ["Dashboard", "Label", "Status", "Events", "Updated", "Purpose"],
    rows: dashboards.map((dashboard) => ({
      href: `#${dashboard.id}`,
      targetId: dashboard.id,
      cells: [dashboard.title, dashboard.label, dashboard.status, dashboard.events, dashboard.updated, dashboard.status === "Draft" ? "Custom dashboard" : "Built-in dashboard"],
      status: dashboard.status,
      filter: slugId(dashboard.status)
    }))
  });
}

function newDashboardPanelMarkup() {
  return `
    <section class="analytics-dashboard-panel dashboard-create-panel" id="dashboard-new" data-dashboard-title="Create dashboard">
      <div class="widget-config-card">
        <header>
          <span>New dashboard</span>
          <strong>Create dashboard</strong>
        </header>
        <p>Give the dashboard a title and label. It will be added to the dashboard register as a custom draft.</p>
        <label>
          <span>Dashboard title</span>
          <input type="text" data-dashboard-field="title" placeholder="Example: Safer play widgets">
        </label>
        <label>
          <span>Label</span>
          <input type="text" data-dashboard-field="label" placeholder="Example: Compliance">
        </label>
        <div class="widget-actions">
          <button class="button button-yellow" type="button" data-ai-action="save-dashboard">Save dashboard</button>
        </div>
      </div>
    </section>
  `;
}

function siteAnalyticsEvents(filters = defaultAnalyticsFilters()) {
  const allEvents = window.PlayAILocalAnalytics?.getEvents() || [];
  return allEvents
    .filter((event) => !PLAYAI_ROUTES.has(event.route))
    .filter((event) => filters.route === "all" || event.route === filters.route)
    .filter((event) => filters.family === "all" || eventMatchesFamily(event, filters.family));
}

function eventMatchesFamily(event, family) {
  if (family === "navigation") {
    return event.eventName === "Primary Navigation Used" || event.eventName === "View Changed";
  }
  if (family === "games") {
    return /Game|Carousel|Search/.test(event.eventName);
  }
  if (family === "registration") {
    return event.eventName.startsWith("Registration ") || event.eventName.startsWith("Offer Registration");
  }
  if (family === "login") {
    return event.eventName.startsWith("Login ");
  }
  if (family === "lotteries") {
    return event.eventName.startsWith("Lottery ") || event.properties?.journey === "lottery-checkout";
  }
  if (family === "widgets") {
    return /Widget|Offer|Feature Switch|Deposit Limit/.test(event.eventName);
  }
  return true;
}

function segmentSummaryPanel(filters, filteredCount, totalCount) {
  const routeLabel = filters.route === "all" ? "All customer routes" : ROUTE_LABELS[filters.route] || filters.route;
  const familyLabel = filters.family === "all" ? "All events" : filters.family;
  return `
    <section class="analytics-segment-summary">
      <div>
        <span>Segment</span>
        <strong>${escapeHtml(routeLabel)} · ${escapeHtml(familyLabel)}</strong>
      </div>
      <p>${filteredCount} of ${totalCount} site events shown. PlayAI tool activity remains excluded from these metrics.</p>
    </section>
  `;
}

function metricDefinitionsPanel() {
  return `
    <section class="metric-definitions">
      <h3>Metric definitions</h3>
      <div>
        <article><strong>Site events</strong><span>Customer-site interactions after PlayAI routes are filtered out.</span></article>
        <article><strong>Nav clicks</strong><span>Primary customer navigation selections, tracked in English for comparable analysis.</span></article>
        <article><strong>Registration events</strong><span>Starts, field progress, step movement and completion signals from the registration overlay.</span></article>
        <article><strong>Pending suggestions</strong><span>AI UX recommendations still waiting for review, approval, rejection or safe application.</span></article>
      </div>
    </section>
  `;
}

function renderExperimentDashboard() {
  if (!experimentDashboardNode) return;
  const events = siteAnalyticsEvents();
  const experiments = [
    homepageOfferExperiment(events),
    registrationExperiment(events),
    loginHandoffExperiment(events),
    lotteryAidExperiment(events)
  ];
  renderExperimentSummary(experiments);
  renderExperimentDependencyMap(experiments);
  experimentDashboardNode.innerHTML = experiments.map(experimentCardMarkup).join("");
}

function renderExperimentSummary(experiments) {
  if (!experimentSummaryNode) return;
  experimentSummaryNode.innerHTML = playAiListPanelMarkup({
    id: "experiments",
    variant: "experiments",
    title: "Experiment register",
    defaultFilter: "all",
    tabs: [
      ["All", experiments.length, "all"],
      ["Active", experiments.length, "active"],
      ["Warnings", experiments.filter((item) => item.interactionWarnings?.length).length, "warning"],
    ],
    columns: ["Experiment", "", "Status", "Sample", "Conversion", "Signal", "Outcome"],
    rows: experiments.map((experiment) => ({
      href: `#experiment-${slugId(experiment.title)}`,
      targetId: `experiment-${slugId(experiment.title)}`,
      cells: [
        playAiTitle(`experiment-${slugId(experiment.title)}`, experiment.title),
        experiment.interactionWarnings?.length ? "warning" : "",
        experiment.status,
        experiment.sampleSize,
        `${experiment.conversionRate}%`,
        experiment.significance.label,
        experiment.outcome
      ],
      status: experiment.status,
      tone: experiment.significance.tone,
      filter: experiment.interactionWarnings?.length ? "active warning" : "active",
      warning: Boolean(experiment.interactionWarnings?.length)
    }))
  });
  renderExperimentDetailMode();
}

function playAiListPanelMarkup({ id = "default", variant = "", title = "Items", tabs = [], columns = [], rows = [], defaultFilter = "", pageSize = 0 }) {
  const safeTabs = tabs.length ? tabs : [["All", rows.length, "all"]];
  const activeFilter = activePlayAiListFilters[id] || defaultFilter || safeTabs[0]?.[2] || "all";
  const activeQuery = activePlayAiListQueries[id] || "";
  const matchingRows = rows.filter((row) => {
    const rowFilters = String(row.filter || slugId(row.status)).split(/\s+/).filter(Boolean);
    const filterMatch = activeFilter === "all" || rowFilters.includes(activeFilter);
    const searchText = row.cells.map(listCellText).join(" ").toLowerCase();
    const searchMatch = !activeQuery || searchText.includes(activeQuery);
    return filterMatch && searchMatch;
  });
  const maxPage = pageSize ? Math.max(1, Math.ceil(matchingRows.length / pageSize)) : 1;
  const currentPage = Math.min(activePlayAiListPages[id] || 1, maxPage);
  activePlayAiListPages[id] = currentPage;
  return `
    <section class="playai-list-panel ${variant ? `is-${escapeHtml(variant)}` : ""}" data-list-id="${escapeHtml(id)}" data-page-size="${escapeHtml(pageSize)}" aria-label="${escapeHtml(title)}">
      <header>
        <div class="playai-list-tabs">
          ${safeTabs.map(([label, count, filter = slugId(label)]) => `
            ${variant === "backlog" && filter === "high" ? `<span class="playai-list-break" aria-hidden="true"></span>` : ""}
            <button type="button" data-list-filter="${escapeHtml(filter)}" class="${filter === activeFilter ? "is-active" : ""}">${escapeHtml(label)} <strong>${escapeHtml(count)}</strong></button>
          `).join("")}
        </div>
        <div class="playai-list-tools">
          <label>
            <span>Filter by</span>
            <select data-list-select aria-label="${escapeHtml(title)} filter">
              ${safeTabs.map(([label, , filter = slugId(label)]) => `
                <option value="${escapeHtml(filter)}" ${filter === activeFilter ? "selected" : ""}>${escapeHtml(label)}</option>
              `).join("")}
            </select>
          </label>
          <label>
            <span class="sr-only">Search ${escapeHtml(title)}</span>
            <input type="search" data-list-search value="${escapeHtml(activeQuery)}" placeholder="Search items" aria-label="Search ${escapeHtml(title)}">
          </label>
        </div>
      </header>
      <div class="playai-list-table" role="table">
        <div class="playai-list-head" role="row">
          ${columns.map((column) => `<span role="columnheader">${escapeHtml(column)}</span>`).join("")}
        </div>
        ${rows.map((row) => {
          const rowFilter = row.filter || slugId(row.status);
          const rowFilters = String(rowFilter).split(/\s+/).filter(Boolean);
          const rowSearchText = row.cells.map(listCellText).join(" ");
          const searchText = rowSearchText.toLowerCase();
          const filterMatch = activeFilter === "all" || rowFilters.includes(activeFilter);
          const searchMatch = !activeQuery || searchText.includes(activeQuery);
          const matchIndex = matchingRows.indexOf(row);
          const pageMatch = !pageSize || (matchIndex >= (currentPage - 1) * pageSize && matchIndex < currentPage * pageSize);
          const hidden = !filterMatch || !searchMatch || !pageMatch;
          return `
          <a class="playai-list-row is-${escapeHtml(slugId(row.status))} is-${escapeHtml(slugId(row.tone || row.status))}${row.warning ? " has-warning" : ""}" href="${escapeHtml(row.href)}" data-target-id="${escapeHtml(row.targetId || String(row.href || "").replace(/^#/, ""))}" data-filter="${escapeHtml(rowFilter)}" data-search="${escapeHtml(rowSearchText)}" role="row" ${hidden ? "hidden" : ""}>
            ${row.cells.map((cell, index) => `
              <span role="cell" ${index === 0 && variant !== "backlog" ? "class=\"is-name\"" : ""}>${listCellMarkup(cell, row, index)}</span>
            `).join("")}
          </a>
        `}).join("")}
      </div>
      ${pageSize ? `
        <footer class="playai-list-pagination">
          <span data-list-page-summary>${matchingRows.length ? ((currentPage - 1) * pageSize) + 1 : 0}-${Math.min(currentPage * pageSize, matchingRows.length)} of ${matchingRows.length}</span>
          <div>
            <button type="button" data-list-page="prev" ${currentPage <= 1 ? "disabled" : ""} aria-label="Previous page">‹</button>
            <button type="button" data-list-page="next" ${currentPage >= maxPage ? "disabled" : ""} aria-label="Next page">›</button>
          </div>
        </footer>
      ` : ""}
    </section>
  `;
}

function listCellText(cell) {
  if (cell && typeof cell === "object") {
    return String(cell.search ?? cell.text ?? "");
  }
  return String(cell ?? "");
}

function listCellMarkup(cell, row, index) {
  if (cell && typeof cell === "object") {
    if (cell.type === "html") return cell.html || "";
    if (cell.type === "status") {
      const value = String(cell.text ?? "");
      return `<strong class="list-status-badge is-${escapeHtml(slugId(value))}">${escapeHtml(value)}</strong>`;
    }
    if (cell.type === "effort") {
      const value = String(cell.text ?? "");
      return `<strong class="list-effort-badge is-${escapeHtml(slugId(value))}">${escapeHtml(value)}</strong>`;
    }
    if (cell.type === "impact") {
      const value = String(cell.text ?? "");
      return `<strong class="list-impact-badge is-${escapeHtml(slugId(value))}">${escapeHtml(value)}</strong>`;
    }
    return escapeHtml(cell.text ?? cell.search ?? "");
  }
  const value = String(cell ?? "");
  if (value === "warning") {
    return `<strong class="list-warning-triangle" aria-label="Interaction warning">!</strong>`;
  }
  if (/^(high|medium|low|unassessed)$/i.test(value)) {
    return `<strong class="list-impact-badge is-${escapeHtml(slugId(value))}">${escapeHtml(value)}</strong>`;
  }
  return escapeHtml(value);
}

function renderExperimentDependencyMap(experiments) {
  const mapNode = document.querySelector("[data-experiment-map]");
  if (!mapNode) return;
  const warnings = experiments.flatMap((experiment) =>
    (experiment.interactionWarnings || []).map((warning) => ({
      title: experiment.title,
      warning
    }))
  );
  mapNode.innerHTML = `
    <article>
      <div>
        <span>Dependency map</span>
        <strong>${warnings.length} possible interactions</strong>
      </div>
      <p>These tests are safe to demo together, but the warnings flag where one experiment may influence another result.</p>
    </article>
    <ul>
      ${warnings.map((item) => `
        <li><strong>${escapeHtml(item.title)}:</strong> ${escapeHtml(item.warning)}</li>
      `).join("") || "<li>No current interaction warnings.</li>"}
    </ul>
  `;
}

function buildExperimentReport() {
  const events = siteAnalyticsEvents();
  const experiments = [
    homepageOfferExperiment(events),
    registrationExperiment(events),
    loginHandoffExperiment(events),
    lotteryAidExperiment(events)
  ];
  return [
    "Impossible Casino AI Experiment report",
    `Generated: ${new Date().toISOString()}`,
    "",
    ...experiments.flatMap((experiment) => [
      experiment.title,
      `Status: ${experiment.status}`,
      `Sample size: ${experiment.sampleSize}`,
      `Conversions: ${experiment.conversions}`,
      `Conversion rate: ${experiment.conversionRate}%`,
      `Average time: ${experiment.averageTime}`,
      `Significance: ${experiment.significance.label}`,
      `Outcome: ${experiment.outcome}`,
      experiment.interactionWarnings?.length
        ? `Warnings: ${experiment.interactionWarnings.join(" | ")}`
        : "Warnings: None",
      "Variants:",
      ...experiment.variants.map((variant) =>
        `- ${variant.label}: ${variant.starts} starts, ${variant.conversions} conversions, ${variant.conversionRate}%, ${variant.timeLabel}`
      ),
      ""
    ])
  ].join("\n");
}

function homepageOfferExperiment(events) {
  const offerIds = ["casino", "bingo", "lotteries"];
  const rows = offerIds.map((offerId) => {
    const impressions = events.filter(
      (event) => event.eventName === "Offer Impression" && event.properties?.offerId === offerId
    ).length;
    const clicks = events.filter(
      (event) => event.eventName === "Offer CTA Clicked" && event.properties?.offerId === offerId
    ).length;
    const completions = events.filter(
      (event) =>
        (event.eventName === "Offer Registration Completed" ||
          event.eventName === "Registration Completed") &&
        event.properties?.offerId === offerId
    ).length;
    return {
      offerId,
      label: offerLabel(offerId),
      impressions,
      clicks,
      completions,
      clickRate: percentOf(clicks, impressions),
      conversionRate: percentOf(completions, impressions)
    };
  });
  const sampleSize = rows.reduce((sum, row) => sum + row.impressions, 0);
  const conversions = rows.reduce((sum, row) => sum + row.clicks, 0);
  const conversionRate = percentOf(conversions, sampleSize);
  const sorted = [...rows].sort((first, second) => second.clickRate - first.clickRate);
  const leader = sorted[0];
  const runnerUp = sorted[1];
  const delta = (leader?.clickRate || 0) - (runnerUp?.clickRate || 0);
  const significance = significanceSignal(sampleSize, delta);

  return {
    title: "Homepage offer mix",
    status: sampleSize >= 60 ? "Active - maturing" : "Active - collecting data",
    summary: "Bingo, Casino and Lottery welcome offers compete for the homepage Join Now action.",
    sampleSize,
    conversions,
    conversionRate,
    averageTime: "Click-through test",
    significance,
    interactionWarnings: [
      "Can influence Registration form layout because each offer CTA opens the same registration journey and may change user motivation before form completion.",
      "Can influence Login entry handoff if offer-led users switch from registration to login during the same session."
    ],
    outcome:
      sampleSize < 15
        ? "Too early to call. Let more homepage views and Join Now clicks collect."
        : delta < 5
          ? "The offers are close. Keep the test running until a clearer click-through gap appears."
          : `${leader.label} is currently leading by ${delta} percentage points on Join Now click-through.`,
    variants: rows.map((row) =>
      experimentVariant(row.label, row.impressions, row.clicks, row.clickRate, `${row.completions} registrations`)
    )
  };
}

function registrationExperiment(events) {
  const registrationEvents = events.filter((event) =>
    event.eventName.startsWith("Registration ")
  );
  const allFields = registrationVariantStats(registrationEvents, "single");
  const stepped = registrationVariantStats(registrationEvents, "stepped");
  const sampleSize = allFields.starts + stepped.starts;
  const conversions = allFields.completions + stepped.completions;
  const conversionRate = percentOf(conversions, sampleSize);
  const delta = allFields.conversionRate - stepped.conversionRate;
  const significance = significanceSignal(sampleSize, delta);
  const leader = delta >= 0 ? allFields.label : stepped.label;

  return {
    title: "Registration form layout",
    status: sampleSize >= 30 ? "Active - maturing" : "Active - collecting data",
    summary: "All fields versus step-by-step registration using the same customer field set.",
    sampleSize,
    conversions,
    conversionRate,
    averageTime: averageRegistrationTimeLabel(registrationEvents),
    significance,
    interactionWarnings: [
      "Can be influenced by Homepage offer mix because offer type and strength may change completion intent before the registration variant is tested.",
      "Can influence Login entry handoff when users move between Join Now and Log In during account setup."
    ],
    outcome:
      sampleSize < 10
        ? "Too early to call. Run more registration journeys before choosing a winner."
        : Math.abs(delta) < 5
          ? "No clear winner yet. Keep the test running until the conversion gap widens or sample size grows."
          : `${leader} is currently ahead by ${Math.abs(delta)} percentage points.`,
    variants: [
      experimentVariant("All fields", allFields.starts, allFields.completions, allFields.conversionRate, allFields.averageTimeLabel),
      experimentVariant("Step by step", stepped.starts, stepped.completions, stepped.conversionRate, stepped.averageTimeLabel)
    ]
  };
}

function loginHandoffExperiment(events) {
  const loginEvents = events.filter((event) => event.eventName.startsWith("Login "));
  const headerStarts = loginEvents.filter(
    (event) => event.eventName === "Login Started" && event.properties?.source === "header-login"
  ).length;
  const gameStarts = loginEvents.filter(
    (event) => event.eventName === "Login Started" && event.properties?.source === "play-button"
  ).length;
  const emailReached = loginEvents.filter((event) => event.eventName === "Login Field Reached").length;
  const continued = loginEvents.filter((event) => event.eventName === "Login Continue Clicked").length;
  const sampleSize = headerStarts + gameStarts;
  const conversionRate = percentOf(continued, sampleSize);
  const significance = significanceSignal(sampleSize, headerStarts - gameStarts);

  return {
    title: "Login entry handoff",
    status: "Monitoring instrumentation",
    summary: "Header login versus game-card launch into the branded login overlay.",
    sampleSize,
    conversions: continued,
    conversionRate,
    averageTime: "Field-level only",
    significance,
    interactionWarnings: [
      "Can be influenced by Homepage offer mix and Registration form layout when users arrive from an offer CTA, abandon registration, then try login."
    ],
    outcome:
      sampleSize < 20
        ? "Keep collecting entry-point data before changing the login handoff."
        : "Source mix is visible; add source-linked completion if this becomes a decision-grade test.",
    variants: [
      experimentVariant("Header login", headerStarts, emailReached, percentOf(emailReached, headerStarts), "To first field"),
      experimentVariant("Game launch", gameStarts, continued, percentOf(continued, gameStarts), "To continue")
    ]
  };
}

function lotteryAidExperiment(events) {
  const quickPicks = events.filter((event) => event.eventName === "Lottery Quick Pick Used").length;
  const dice = events.filter((event) => event.eventName === "Lottery Dice Used").length;
  const manualPicks = events.filter((event) => event.eventName === "Lottery Number Selected").length;
  const checkouts = events.filter(
    (event) => event.eventName === "Layout Saved" && event.properties?.journey === "lottery-checkout"
  ).length;
  const aidedStarts = quickPicks + dice;
  const manualStarts = manualPicks ? Math.max(1, Math.round(manualPicks / 7)) : 0;
  const sampleSize = aidedStarts + manualStarts;
  const conversionRate = percentOf(checkouts, sampleSize);
  const significance = significanceSignal(sampleSize, aidedStarts - manualStarts);

  return {
    title: "Lottery completion aids",
    status: "Active - early signal",
    summary: "Manual number picking compared with dice and quick-pick assisted ticket building.",
    sampleSize,
    conversions: checkouts,
    conversionRate,
    averageTime: "Not timed yet",
    significance,
    outcome:
      sampleSize < 20
        ? "Early behaviour only. Continue testing manual, dice and quick-pick journeys."
        : aidedStarts > manualStarts
          ? "Assisted selection is seeing stronger use; consider making quick pick more prominent."
          : "Manual selection is still carrying the flow; keep aids available but avoid over-promoting them.",
    variants: [
      experimentVariant("Manual picks", manualStarts, checkouts, percentOf(checkouts, manualStarts), "Ticket path"),
      experimentVariant("Dice + quick pick", aidedStarts, checkouts, percentOf(checkouts, aidedStarts), "Assisted path")
    ]
  };
}

function experimentVariant(label, starts, conversions, conversionRate, timeLabel) {
  return { label, starts, conversions, conversionRate, timeLabel };
}

function experimentCardMarkup(experiment) {
  return `
    <article class="experiment-card" id="experiment-${escapeHtml(slugId(experiment.title))}">
      <header>
        <div>
          <span>${escapeHtml(experiment.status)}</span>
          ${editablePlayAiTitleMarkup(`experiment-${slugId(experiment.title)}`, experiment.title, "h3")}
          <p>${escapeHtml(experiment.summary)}</p>
        </div>
        <strong class="experiment-signal is-${escapeHtml(experiment.significance.tone)}">${escapeHtml(experiment.significance.label)}</strong>
      </header>
      <div class="experiment-metrics">
        ${experimentMetric("Sample size", experiment.sampleSize)}
        ${experimentMetric("Conversions", experiment.conversions)}
        ${experimentMetric("Conversion", `${experiment.conversionRate}%`)}
        ${experimentMetric("Avg time", experiment.averageTime)}
      </div>
      ${experimentWarningsMarkup(experiment.interactionWarnings)}
      <div class="experiment-variants">
        ${experiment.variants.map((variant) => `
          <section class="experiment-variant">
            <div>
              <strong>${escapeHtml(variant.label)}</strong>
              <span>${variant.starts} starts · ${variant.conversions} conversions · ${escapeHtml(variant.timeLabel)}</span>
            </div>
            <em>${variant.conversionRate}%</em>
            <b style="--bar:${variant.conversionRate}%"></b>
          </section>
        `).join("")}
      </div>
      <footer>
        <strong>Outcome</strong>
        <p>${escapeHtml(experiment.outcome)}</p>
      </footer>
    </article>
  `;
}

function slugId(value) {
  return String(value || "item")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "item";
}

function experimentWarningsMarkup(warnings = []) {
  if (!warnings.length) return "";
  return `
    <aside class="experiment-warning" aria-label="Experiment interaction warning">
      <strong>Interaction warning</strong>
      <ul>
        ${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join("")}
      </ul>
    </aside>
  `;
}

function experimentMetric(label, value) {
  return `
    <section>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </section>
  `;
}

function percentOf(count, total) {
  return total ? Math.min(100, Math.round((count / total) * 100)) : 0;
}

function significanceSignal(sampleSize, delta) {
  const gap = Math.abs(delta);
  if (sampleSize < 20) {
    return { label: "Collecting", tone: "collecting" };
  }
  if (sampleSize < 50 || gap < 6) {
    return { label: "Directional", tone: "directional" };
  }
  return { label: "Strong signal", tone: "strong" };
}

function averageRegistrationTimeLabel(events) {
  const stats = ["single", "stepped"].map((variant) => registrationVariantStats(events, variant));
  const labels = stats
    .map((item) => item.averageTimeLabel)
    .filter((label) => label !== "No completions");
  return labels.length ? labels.join(" / ") : "No completions";
}

function suggestionPreviewMarkup(suggestion) {
  const componentText = [
    suggestion.affectedComponent,
    ...(suggestion.affectedComponents || [])
  ].join(" ");
  const game = currentGames.find((item) =>
    componentText.toLowerCase().includes(item.name.toLowerCase())
  );

  if (game?.image) {
    return `
      <aside class="suggestion-preview">
        <span>Element preview</span>
        <img src="${escapeHtml(game.image)}" alt="">
        <strong>${escapeHtml(game.name)}</strong>
        <small>${escapeHtml(game.provider || "Game card")}</small>
      </aside>
    `;
  }

  if (/search/i.test(componentText)) {
    return `
      <aside class="suggestion-preview suggestion-preview-ui">
        <span>Element preview</span>
        <div class="preview-search">
          <b>Search</b>
          <em>Game name or provider</em>
        </div>
      </aside>
    `;
  }

  if (/save/i.test(componentText) || /cta/i.test(suggestion.title)) {
    return `
      <aside class="suggestion-preview suggestion-preview-ui">
        <span>Element preview</span>
        <button type="button">Save lobby</button>
      </aside>
    `;
  }

  return `
    <aside class="suggestion-preview suggestion-preview-ui">
      <span>Element preview</span>
      <div class="preview-generic">
        <i></i>
        <strong>${escapeHtml(suggestion.affectedComponent || "Component")}</strong>
      </div>
    </aside>
  `;
}

function updateRoute() {
  const route = normaliseRoute(location.hash);
  document.querySelectorAll("[data-page]").forEach((section) => {
    const routes = section.dataset.page.split(/\s+/);
    section.hidden = !routes.includes(route);
  });
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.routeLink === route);
  });
  document.body.dataset.route = route;
  document.body.dataset.playaiMode = PLAYAI_ROUTES.has(route) ? "workspace" : "site";
  document.body.classList.toggle("is-launch-mode", new URLSearchParams(window.location.search).get("launch") === "site");
  if (route !== lastTrackedRoute) {
    trackUxEvent("View Changed", { route });
    lastTrackedRoute = route;
    if (route === "home" && offerExperimentInitialised) {
      rotateHomepageOffer("route");
    }
  }
  renderAiUxViews();
  renderWidgets();
  updateStudioDockContext();
  if (!location.hash) history.replaceState(null, "", "#home");
}

function normaliseRoute(hash) {
  const route = hash.replace(/^#/, "") || "home";
  if (route === "playai-home") return "ai-markets";
  if (route === "featured" || route === "all-games") return "games";
  if (route === "live-all") return "live";
  if (route === "bingo-all") return "bingo";
  if (route === "draws") return "lotteries";
  if (route === "rewards") return "promos";
  if (route.startsWith("help-")) return "help";
  if (route === "how-it-works") return "home";
  return ROUTES.has(route) ? route : "home";
}

function placeholderBackground(source) {
  const brand = selectedBrandId();
  if (brand === "dark-technical") {
    const accent =
      source === "live"
        ? "rgba(103, 232, 255, .28)"
        : source === "bingo"
          ? "rgba(22, 217, 255, .22)"
          : "rgba(103, 232, 255, .18)";
    return `linear-gradient(rgba(103, 232, 255, .055) 1px, transparent 1px), linear-gradient(90deg, rgba(103, 232, 255, .055) 1px, transparent 1px), radial-gradient(circle at 82% 18%, ${accent} 0 28px, transparent 29px), linear-gradient(135deg, #0d2846, #07101f)`;
  }
  if (brand === "lottoland") {
    const accent =
      source === "live"
        ? "rgba(53, 247, 115, .24)"
        : source === "bingo"
          ? "rgba(255, 63, 112, .2)"
          : "rgba(53, 247, 115, .18)";
    return `radial-gradient(circle at 82% 18%, ${accent} 0 30px, transparent 31px), linear-gradient(135deg, #111c49, #050b2d)`;
  }
  const colour =
    source === "live"
      ? "#4b22a3"
      : source === "bingo"
        ? "#13b7b1"
        : "#ff4fb8";
  return `radial-gradient(circle at 70% 25%, #ffe85c 0 20px, transparent 21px), linear-gradient(135deg, ${colour}, #35116f)`;
}

function setStatus(message, count = "") {
  if (statusNode) statusNode.textContent = message;
  if (countNode) countNode.textContent = count;
}

function trackUxEvent(eventName, properties = {}) {
  window.PlayAILocalAnalytics?.track(eventName, properties);
}

function trackRegistrationProgress(eventName, properties = {}) {
  trackUxEvent(eventName, {
    component: "Registration modal",
    ...properties
  });
}

function initialiseHomepageOffer(reason = "startup") {
  if (offerExperimentInitialised) return;
  offerExperimentInitialised = true;
  rotateHomepageOffer(reason);
}

function rotateHomepageOffer(reason = "route") {
  if (normaliseRoute(location.hash) !== "home") return;
  const offerCards = [...document.querySelectorAll("[data-offer-card]")];
  if (!offerCards.length) return;
  const nextIndex = nextOfferExperimentIndex(offerCards.length);
  const activeCard = offerCards[nextIndex];
  activeOfferId = activeCard.dataset.offerCard;
  offerCards.forEach((card, index) => {
    const active = index === nextIndex;
    card.classList.toggle("is-active", active);
    card.setAttribute("aria-hidden", active ? "false" : "true");
  });
  const impressionKey = `${reason}:${activeOfferId}:${lastTrackedRoute}`;
  if (lastOfferImpressionRouteKey === impressionKey) return;
  lastOfferImpressionRouteKey = impressionKey;
  trackOfferExperimentEvent("Offer Impression", activeOfferId, {
    position: nextIndex + 1,
    reason
  });
}

function nextOfferExperimentIndex(total) {
  const current = Number(sessionStorage.getItem(OFFER_EXPERIMENT_INDEX_KEY) || "-1");
  const next = Number.isFinite(current) ? (current + 1) % total : 0;
  sessionStorage.setItem(OFFER_EXPERIMENT_INDEX_KEY, String(next));
  return next;
}

function trackOfferExperimentEvent(eventName, offerId, properties = {}) {
  if (!offerId) return;
  trackUxEvent(eventName, {
    experimentId: "homepage-offer-mix",
    experimentName: "Homepage offer mix",
    offerId,
    offerLabel: offerLabel(offerId),
    ...properties
  });
}

function offerLabel(offerId) {
  const labels = {
    casino: "Casino - 50 free spins",
    bingo: "Bingo - £10 bingo bonus",
    lotteries: "Lotteries - first line on us"
  };
  return labels[offerId] || offerId || "Unknown offer";
}

function trackCarouselUsed(properties = {}) {
  trackUxEvent("Carousel Used", {
    component: "Carousel",
    ...properties
  });
}

function gameAnalyticsProperties(game, context = {}) {
  if (!game) return context;
  return {
    gameId: game.id,
    gameName: game.name,
    gameType: game.source,
    gameCategory: SOURCE_LABELS[game.source],
    gameProvider: game.provider,
    sectionName: context.sectionName,
    position:
      context.position === "" || context.position === undefined
        ? undefined
        : Number(context.position),
    isFavourite: builderState.carousels.some((carousel) => carousel.gameIds.includes(game.id))
  };
}

function metricCard(label, value, id = slugId(label), dashboardId = "", editing = false) {
  return `
    <article draggable="${editing ? "true" : "false"}" data-metric-id="${escapeHtml(id)}" data-dashboard-id="${escapeHtml(dashboardId)}">
      <em class="drag-handle metric-drag-handle" aria-hidden="true"></em>
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </article>
  `;
}

function analyticsPanel(title, rows) {
  return `
    <section>
      <h3>${escapeHtml(title)}</h3>
      ${rows.length ? `<ul>${rows.map((row) => `<li>${row}</li>`).join("")}</ul>` : "<p>No data yet.</p>"}
    </section>
  `;
}

function registrationVariantComparison(events) {
  const rows = ["single", "stepped"].map((variant) =>
    registrationVariantStats(events, variant)
  );
  return `
    <section class="registration-variant-card">
      <header>
        <div>
          <h3>Registration implementation results</h3>
          <p>Conversion rate and average time to convert by registration flow.</p>
        </div>
      </header>
      <div class="registration-variant-grid">
        ${rows.map((row) => `
          <article>
            <span>${row.label}</span>
            <strong>${row.conversionRate}%</strong>
            <div class="variant-bar"><b style="--bar:${row.conversionRate}%"></b></div>
            <dl>
              <div><dt>Started</dt><dd>${row.starts}</dd></div>
              <div><dt>Completed</dt><dd>${row.completions}</dd></div>
              <div><dt>Avg time</dt><dd>${row.averageTimeLabel}</dd></div>
            </dl>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function registrationVariantStats(events, variant) {
  const starts = events.filter(
    (event) =>
      event.eventName === "Registration Started" &&
      event.properties?.variant === variant
  );
  const completions = events.filter(
    (event) =>
      event.eventName === "Registration Completed" &&
      event.properties?.variant === variant
  );
  const durations = completions
    .map((completion) => {
      const completedAt = new Date(completion.timestamp).getTime();
      const start = starts
        .filter((event) => new Date(event.timestamp).getTime() <= completedAt)
        .at(-1);
      return start
        ? completedAt - new Date(start.timestamp).getTime()
        : null;
    })
    .filter((duration) => Number.isFinite(duration));
  const average = durations.length
    ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length
    : 0;

  return {
    label: variant === "single" ? "All fields" : "Step by step",
    starts: starts.length,
    completions: completions.length,
    conversionRate: starts.length ? Math.round((completions.length / starts.length) * 100) : 0,
    averageTimeLabel: average ? formatDuration(average) : "No completions"
  };
}

function pieChartPanel(title, rows) {
  const total = rows.reduce((sum, [, count]) => sum + count, 0);
  const topRows = rows.slice(0, 5);
  let start = 0;
  const colours = ["#0d2846", "#1f8db3", "#67e8ff", "#78a6bd", "#b7d8e8"];
  const gradient = topRows.length
    ? topRows.map(([, count], index) => {
        const end = start + (count / total) * 100;
        const slice = `${colours[index]} ${start}% ${end}%`;
        start = end;
        return slice;
      }).join(", ")
    : "#e7f2f8 0 100%";

  return `
    <section class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="pie-chart" style="--pie:${gradient}"><span>${total ? "100%" : "0%"}</span></div>
      ${chartLegend(topRows, total, colours)}
    </section>
  `;
}

function barChartPanel(title, rows, emptyText = "No navigation yet.") {
  const total = rows.reduce((sum, [, count]) => sum + count, 0);
  const max = Math.max(...rows.map(([, count]) => count), 1);
  return `
    <section class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="bar-chart">
        ${rows.slice(0, 8).map(([label, count]) => {
          const width = Math.round((count / max) * 100);
          const percent = total ? Math.round((count / total) * 100) : 0;
          return `
            <div>
              <span>${escapeHtml(label)}</span>
              <b style="--bar:${width}%"></b>
              <strong>${percent}%</strong>
            </div>
          `;
        }).join("") || `<p>${escapeHtml(emptyText)}</p>`}
      </div>
    </section>
  `;
}

function funnelChartPanel(title, rows) {
  const first = rows[0]?.count || 0;
  return `
    <section class="chart-card">
      <h3>${escapeHtml(title)}</h3>
      <div class="funnel-chart">
        ${rows.map((row, index) => {
          const previous = rows[index - 1]?.count || row.count;
          const percentFromFirst = first ? Math.round((row.count / first) * 100) : 0;
          const percentFromPrevious = previous ? Math.round((row.count / previous) * 100) : 0;
          return `
            <div style="--funnel:${percentFromFirst}%">
              <span>${escapeHtml(row.label)}</span>
              <strong>
                ${row.count}
                <em>${percentFromFirst}% first</em>
                <em>${percentFromPrevious}% prev</em>
              </strong>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function chartLegend(rows, total, colours) {
  if (!rows.length) return "<p>No primary navigation clicks yet.</p>";
  return `
    <ul class="chart-legend">
      ${rows.map(([label, count], index) => `
        <li>
          <i style="background:${colours[index]}"></i>
          <span>${escapeHtml(label)}</span>
          <strong>${total ? Math.round((count / total) * 100) : 0}%</strong>
        </li>
      `).join("")}
    </ul>
  `;
}

function lotteryDayLabel(day) {
  if (day === "all") return "Tue + Fri";
  if (day === "tue") return "Tuesday";
  if (day === "fri") return "Friday";
  return "Unknown";
}

function quickPickLabel(amount) {
  if (amount === "all") return "All cards";
  return `${amount || 0} card${amount === "1" ? "" : "s"}`;
}

function registrationFunnelRows(events) {
  const starts = events.filter((event) => event.eventName === "Registration Started").length;
  const singleStarts = events.filter(
    (event) =>
      event.eventName === "Registration Started" &&
      event.properties?.variant === "single"
  ).length;
  const completed = events.filter((event) => event.eventName === "Registration Completed").length;
  return [
    { label: "Started", count: starts },
    ...registrationSteps.map((step, index) => ({
      label: step.title,
      count: events.filter(
        (event) =>
          event.eventName === "Registration Step Viewed" &&
          event.properties?.stepIndex === index
      ).length + (index === 0 ? starts : singleStarts)
    })),
    {
      label: "Completed",
      count: completed
    }
  ];
}

function loginFunnelRows(events) {
  const starts = events.filter((event) => event.eventName === "Login Started").length;
  const email = events.filter(
    (event) =>
      event.eventName === "Login Field Reached" &&
      event.properties?.fieldName === "email"
  ).length;
  const password = events.filter(
    (event) =>
      event.eventName === "Login Field Reached" &&
      event.properties?.fieldName === "password"
  ).length;
  const continued = events.filter((event) => event.eventName === "Login Continue Clicked").length;
  return [
    { label: "Started", count: starts },
    { label: "Email field", count: email },
    { label: "Password field", count: password },
    { label: "Continue button", count: continued }
  ];
}

function countBy(items, getter) {
  const counts = new Map();
  items.forEach((item) => {
    const key = getter(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function formatEventTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatDuration(milliseconds) {
  const seconds = Math.max(1, Math.round(milliseconds / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return remainder ? `${minutes}m ${remainder}s` : `${minutes}m`;
}

function downloadTextFile(filename, contents) {
  const blob = new Blob([contents], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

function createId() {
  return crypto.randomUUID?.() || `carousel-${Date.now()}-${Math.random()}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
