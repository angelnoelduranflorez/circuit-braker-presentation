# Discurso: Circuit Breaker - Patrón de Resiliencia

**Duración estimada: 1 hora y 5 minutos**

---

## Slide 1 — Portada (3 minutos)

Buenos días/tardes a todos. Mi nombre es Angel Duran, estoy acompañado de Daniel Felipe Melo, y queremos darles la bienvenida a esta presentación sobre un tema que consideramos fundamental para cualquier desarrollador backend que trabaje con arquitecturas modernas: el **Circuit Breaker**.

Antes de empezar, quiero hacerles una pregunta: ¿alguna vez les ha pasado que están usando una aplicación — digamos un e-commerce — y de repente todo se pone lento, empiezan a salir errores, y al final toda la plataforma se cae? Eso probablemente fue una falla en cascada. Y justamente de eso vamos a hablar hoy: de cómo prevenirlo.

El Circuit Breaker es una de las herramientas más poderosas que tenemos como ingenieros de software para construir sistemas que no se derrumben como fichas de dominó cuando algo falla. Y en un mundo donde dependemos de decenas o cientos de microservicios interconectados, entender este patrón no es opcional — es esencial.

A lo largo de esta sesión vamos a entender el concepto desde sus fundamentos, veremos cómo funciona internamente, analizaremos ejemplos reales de código, y al final tendremos un simulador interactivo para que experimenten ustedes mismos.

---

## Slide 2 — Agenda: Conceptos (2 minutos)

Comencemos con la agenda. Hemos estructurado esta presentación en dos grandes bloques.

El primer bloque cubre los **conceptos fundamentales** que necesitamos entender antes de hablar del Circuit Breaker propiamente dicho. Vamos a arrancar definiendo qué es la resiliencia, cómo se aplica específicamente en el desarrollo de software, cuál es su historia y de dónde viene este concepto. Luego veremos las características clave que debe tener un sistema resiliente, cómo se hacen pruebas de resiliencia — que es un campo fascinante — , cómo se aplica todo esto en entornos distribuidos, y finalmente hablaremos del impacto real y el valor de negocio que aporta.

Este primer bloque es importante porque el Circuit Breaker no existe en el vacío. Es una herramienta dentro de un ecosistema más grande de prácticas de resiliencia, y para usarlo correctamente necesitamos entender ese contexto.

---

## Slide 3 — Agenda: Circuit Breaker (2 minutos)

En el segundo bloque entramos de lleno al **Circuit Breaker**. Empezaremos con una analogía visual de falla en cascada que les va a dejar muy claro por qué necesitamos este patrón. Luego explicaremos en detalle cómo funciona con sus tres estados y transiciones.

Veremos los dos enfoques de funcionamiento — por conteo y por tiempo — , analizaremos honestamente las ventajas y también las limitaciones que tiene. Revisaremos las implementaciones más populares en distintos lenguajes, y cerraremos con ejemplos prácticos en Python y Java, además de los parámetros de configuración que necesitan conocer.

Al final tendremos un simulador interactivo donde podrán jugar con los parámetros y ver en tiempo real cómo se comporta un circuit breaker. Así que quédense hasta el final que es la parte más divertida.

---

## Slide 4 — Resiliencia (3 minutos)

Bien, arranquemos con el primer concepto: **Resiliencia**.

La palabra resiliencia viene del latín "resilire", que significa "saltar hacia atrás" o "rebotar". En física de materiales, se refiere a la capacidad de un material para absorber energía cuando se deforma elásticamente y luego liberarla al recuperar su forma original. Piensen en una pelota de goma: la comprimes, se deforma, pero vuelve a su forma original.

En el contexto de sistemas de software, resiliencia es la capacidad de un sistema para **recuperarse rápidamente de fallos y continuar operando**.

Noten algo importante en esta definición: no dice "la capacidad de nunca fallar". Eso sería robustez, que es un concepto diferente del que hablaremos más adelante. La resiliencia acepta una verdad fundamental: **todo sistema va a fallar en algún momento**. La pregunta no es si va a fallar, sino cuándo, y qué tan rápido y elegantemente se va a recuperar.

Es un cambio de paradigma mental. Pasamos de "voy a construir un sistema que nunca falle" — que es imposible en sistemas distribuidos — a "voy a construir un sistema que se recupere rápido cuando falle".

---

## Slide 5 — Resiliencia en Software (4 minutos)

Ahora, ¿cómo se traduce esto específicamente al software?

En el contexto del desarrollo, la resiliencia significa que nuestro sistema puede **anticipar, resistir, recuperarse y adaptarse** a condiciones adversas, ataques o fallos. Veamos cada uno de estos verbos:

**Anticipar**: diseñar desde el inicio pensando en qué puede salir mal. ¿Qué pasa si la base de datos no responde? ¿Qué pasa si un servicio externo está lento? ¿Qué pasa si hay un pico de tráfico inesperado?

**Resistir**: tener la capacidad de seguir operando — aunque sea de forma degradada — mientras ocurre el problema.

**Recuperarse**: volver al estado normal de operación de forma automática, sin requerir que alguien reinicie un servidor manualmente a las 3 de la mañana.

**Adaptarse**: aprender del fallo y ajustar el comportamiento para ser más resistente en el futuro.

En la práctica, un sistema resiliente se comporta así: está en estado normal, ocurre un fallo en una de sus dependencias, el sistema se degrada — quizás desactiva una funcionalidad no crítica o usa datos en caché — pero sigue respondiendo a los usuarios. Y cuando el problema se resuelve, se auto-recupera y vuelve a operar al 100%.

Comparen esto con un sistema no resiliente: está en estado normal, ocurre un fallo, y todo se cae. Error 500 para todos. Hay que despertar a alguien, reiniciar servicios, verificar datos. Horas de downtime.

---

## Slide 6 — Historia de la Resiliencia (4 minutos)

La historia de la resiliencia en software está íntimamente ligada a **Netflix**, y es una historia fascinante.

En **2004**, Netflix comienza su migración de data centers propios a la nube de Amazon Web Services. Ese movimiento los expuso a un nuevo tipo de fallos: fallos de red, instancias que desaparecen, servicios con latencia variable. Era un mundo completamente diferente al de un data center controlado.

Para **2010**, los ingenieros de Netflix empiezan a formalizar los conceptos de lo que hoy conocemos como **Chaos Engineering**. La idea era radical: si los fallos van a ocurrir en producción, mejor provocarlos intencionalmente en horario laboral cuando todo el equipo está disponible, que esperar a que ocurran un sábado a las 2am.

En **2011** nace **Hystrix**, la primera librería de circuit breaker ampliamente adoptada. Netflix la construyó para sus propias necesidades y la liberó como open source. Fue un antes y después en cómo la industria pensaba sobre la resiliencia.

En **2012**, Netflix lanza **Chaos Monkey** como parte de su "Simian Army" — un conjunto de herramientas que literalmente apagan servidores aleatorios en producción para verificar que el sistema se recupera. Cuando la comunidad se enteró de esto, muchos pensaron que estaban locos. Hoy es una práctica estándar.

Para **2017** surge **Resilience4j** como sucesor moderno de Hystrix. Es más ligero, modular, y diseñado para Java 8+ con programación funcional.

En **2018** Hystrix entra oficialmente en modo mantenimiento. Netflix lo sigue usando internamente pero ya no acepta contribuciones externas.

**Hoy**, la resiliencia es un pilar fundamental de cualquier arquitectura cloud-native. No es un "nice to have" — es un requisito.

---

## Slide 7 — Características Clave (4 minutos)

¿Cuáles son las características que debe tener un sistema para considerarse resiliente? Hemos identificado seis fundamentales:

**Recuperación Automática**: El sistema se restaura sin intervención humana. Si un servicio se cae y vuelve a subir, el sistema lo detecta y retoma las operaciones normales automáticamente. No debería requerir que alguien reinicie algo manualmente.

**Aislamiento de Fallos**: Este es crucial. Si el servicio de recomendaciones de productos se cae, eso no debería afectar al proceso de checkout. Cada componente fallido debe estar aislado para que no contamine al resto. Esto se logra con patrones como Bulkhead — que veremos brevemente — y por supuesto, Circuit Breaker.

**Degradación Elegante**: En vez de dar un error 500 al usuario, el sistema ofrece funcionalidad reducida. Por ejemplo, si el servicio de recomendaciones falla, se muestra una lista genérica de productos populares. El usuario ni se entera de que algo anda mal.

**Observabilidad**: No puedes arreglar lo que no puedes ver. Un sistema resiliente tiene monitoreo y métricas en tiempo real sobre la salud de cada componente. Dashboards, alertas, logs estructurados, traces distribuidos.

**Fail-Fast**: Cuando algo está mal, es mejor saberlo inmediatamente que esperar 30 segundos a un timeout. Detectar y reportar errores rápidamente permite tomar decisiones rápidas — como activar un fallback.

**Redundancia**: Tener componentes de respaldo listos para tomar el control. Puede ser a nivel de instancias, zonas de disponibilidad, o incluso regiones geográficas.

---

## Slide 8 — Pruebas de Resiliencia (4 minutos)

Ahora, ¿cómo verificamos que nuestro sistema es realmente resiliente? No basta con implementar patrones y cruzar los dedos. Necesitamos **probarlo**.

Aquí entra el **Chaos Engineering** — la disciplina de experimentar en un sistema para construir confianza en su capacidad de soportar condiciones turbulentas en producción. El principio fundamental es: "si no lo has probado rompiéndolo, no sabes si funciona."

Las herramientas más populares para esto son:

- **Chaos Monkey** de Netflix: la original. Apaga instancias aleatoriamente en producción.
- **Gremlin**: plataforma comercial de chaos engineering con una interfaz amigable y escenarios predefinidos.
- **LitmusChaos**: orientada a Kubernetes, open source, muy popular en entornos cloud-native.
- **AWS Fault Injection Simulator**: el servicio de AWS para inyectar fallos en tu infraestructura de forma controlada.

Los tipos de pruebas que realizamos incluyen:

- **Inyección de fallos de red**: simular que la red entre dos servicios se corta o tiene alta latencia.
- **Introducción de latencia**: hacer que un servicio responda artificialmente lento para ver cómo reacciona el caller.
- **Saturación de recursos**: llenar la CPU, memoria o disco para ver cómo se comporta el sistema bajo estrés.
- **Caída de instancias**: apagar servidores para verificar que el load balancer y la redundancia funcionan.
- **Pérdida de zona de disponibilidad**: simular que toda una AZ de AWS se cae.

Lo importante es hacer estas pruebas de forma **controlada y gradual**, empezando por ambientes de staging y con blast radius limitado antes de hacerlo en producción.

---

## Slide 9 — Aplicación en Entornos Distribuidos (4 minutos)

Hablemos ahora de por qué la resiliencia es especialmente crítica en entornos distribuidos — que es donde la mayoría de nosotros trabajamos hoy.

Los sistemas distribuidos tienen una complejidad inherente que los sistemas monolíticos no tienen. Tenemos múltiples servicios comunicándose constantemente por red. Y la red no es confiable — es una de las famosas "falacias de la computación distribuida". Cada llamada remota puede fallar por timeout, por error de red, por sobrecarga del servicio destino. La latencia es variable e impredecible. Y los fallos parciales son la norma, no la excepción.

Los fallos más comunes que vemos en arquitecturas de microservicios son:

- **Timeouts de red**: el servicio no responde en el tiempo esperado.
- **Servicios sobrecargados**: demasiado tráfico para su capacidad actual.
- **Dependencias en cascada**: servicio A depende de B, que depende de C, que depende de D. Si D falla, potencialmente todo falla.
- **Agotamiento de thread pools**: los threads se quedan bloqueados esperando respuestas que nunca llegan, y eventualmente no hay threads disponibles para nuevas solicitudes.

Para combatir estos escenarios, contamos con un conjunto de patrones de resiliencia que trabajan en conjunto: **Circuit Breaker** (nuestro protagonista de hoy), **Retry** (reintentar con backoff exponencial), **Timeout** (no esperar indefinidamente), **Bulkhead** (aislar recursos por servicio), **Rate Limiter** (controlar el flujo de solicitudes), y **Fallback** (respuestas alternativas).

El Circuit Breaker es probablemente el más importante de todos porque protege contra el escenario más destructivo: la falla en cascada.

---

## Slide 10 — Impacto de la Resiliencia (3 minutos)

Hablemos de números concretos, porque al final del día necesitamos justificar estas inversiones de ingeniería ante el negocio.

Los sistemas críticos apuntan a un **99.99%** de disponibilidad — lo que llamamos "cuatro nueves". Eso suena impresionante hasta que haces la cuenta: 99.99% significa que solo tienes **52 minutos** de downtime permitido en todo el año. Menos de una hora. Cualquier incidente que dure más de eso ya te saca del SLA.

El costo promedio por hora de inactividad para empresas de tecnología supera los **300 mil dólares**. Y para empresas como Amazon, se estima que una hora de caída cuesta más de 13 millones de dólares en ventas perdidas.

Un dato que me parece muy revelador: el **80% de las caídas** en producción son causadas por cambios en el código o configuración, y por fallos en cascada. No son ataques externos ni desastres naturales — son problemas que podemos prevenir y mitigar con buenas prácticas de resiliencia.

La resiliencia no es un lujo técnico ni un capricho de ingeniería. Es una **necesidad de negocio** directamente ligada a los ingresos y la reputación de la empresa.

---

## Slide 11 — Valor de la Resiliencia (3 minutos)

El valor de invertir en resiliencia se manifiesta en cuatro dimensiones principales:

**Reducción de Costos**: Cuando un sistema es resiliente, los incidentes tienen menor impacto financiero. Los war rooms son más cortos — o no se necesitan. El equipo no está apagando incendios constantemente y puede enfocarse en construir valor. El costo de un incidente bien manejado por un sistema resiliente puede ser 10x menor que uno sin resiliencia.

**Experiencia del Usuario**: Los usuarios no ven errores 500 ni páginas en blanco. Ven continuidad del servicio, quizás con alguna funcionalidad reducida que ni notan. Una degradación graceful — como mostrar datos en caché en vez de datos en tiempo real — es infinitamente mejor que una pantalla de error.

**Reputación**: La confianza del cliente se construye en años y se destruye en minutos. Un sistema que cumple sus SLAs consistentemente genera confianza. Y en mercados competitivos, la disponibilidad puede ser el diferenciador. Si tu competidor se cae cada semana y tú no, ¿a quién le van a comprar?

**Velocidad de Desarrollo**: Equipos que confían en la resiliencia de su sistema hacen despliegues más frecuentes y con más confianza. Saben que si algo sale mal, el sistema se protege solo mientras hacen rollback. Esto acelera la innovación.

---

## Slide 12 — Resiliencia vs Robustez (3 minutos)

Antes de avanzar al Circuit Breaker, quiero aclarar una confusión común: la diferencia entre resiliencia y robustez. Son conceptos complementarios pero fundamentalmente diferentes.

La **resiliencia** se recupera de fallos. Acepta que los errores van a ocurrir y diseña para el fallo. Es adaptativa y dinámica — se ajusta a las condiciones cambiantes. Cuando algo falla, responde elegantemente: un fallback, una degradación, pero sigue funcionando.

La **robustez**, en cambio, resiste sin cambiar. Intenta prevenir todos los errores con un diseño defensivo. Es estática y rígida — funciona bien dentro de sus parámetros diseñados, pero si el problema supera esos parámetros, sufre un fallo total y catastrófico.

Piénsenlo así: un edificio robusto resiste un terremoto de magnitud 7 sin moverse. Pero si viene uno de magnitud 8, se derrumba completamente. Un edificio resiliente quizás se mueve, quizás sufre algunos daños menores, pero no se derrumba y puede seguir siendo habitado mientras se repara.

En software necesitamos ambas cosas, pero en sistemas distribuidos la resiliencia es más importante porque los fallos son impredecibles y variados. No puedes anticipar todos los modos de fallo posibles.

---

## Slide 13 — Consecuencias de un Software no Resiliente (3 minutos)

Para que quede clara la motivación, veamos qué pasa cuando un sistema no es resiliente:

**Fallas en cascada**: El escenario más temido. Un servicio se cae y como nadie maneja ese fallo correctamente, va derribando servicio tras servicio como fichas de dominó hasta que todo el sistema está caído.

**Tiempos de respuesta degradados**: Antes de la caída total, los usuarios experimentan lentitud extrema. Solicitudes que deberían tomar 200ms toman 30 segundos. Los usuarios se frustran, refrescan la página — generando más carga — y empeoran el problema.

**Pérdidas económicas**: Cada segundo de caída son transacciones que no se procesan, carritos de compra abandonados, clientes que se van a la competencia.

**Agotamiento de recursos**: Los threads se quedan bloqueados esperando, las conexiones a base de datos se agotan, la memoria se llena con solicitudes encoladas. El servidor se queda sin capacidad para hacer nada.

**Pérdida de confianza**: La reputación tarda años en construirse y minutos en destruirse. Un par de caídas graves y los clientes empiezan a buscar alternativas.

**Recuperación manual**: Alguien tiene que levantarse a las 3 de la mañana, conectarse por VPN, diagnosticar el problema, reiniciar servicios en orden, verificar integridad de datos. Esto puede tomar horas.

Todos estos problemas son prevenibles — o al menos mitigables — con patrones de resiliencia bien implementados. Y el Circuit Breaker es nuestra primera línea de defensa.

---

## Slide 14 — ¿Qué es Circuit Breaker? (4 minutos)

El **Circuit Breaker** es un patrón de arquitectura de microservicios que previene que un cliente invoque de forma continua a un servicio que está fallando o que tiene un problema de performance.

Déjenme repetir eso porque es la esencia: **previene invocaciones continuas a un servicio que está fallando**. Es un mecanismo de protección que dice "oye, ese servicio no está respondiendo bien, deja de llamarlo por un rato, dale tiempo de recuperarse."

La analogía más intuitiva es la de un **interruptor térmico** — el breaker que tienen en el tablero eléctrico de su casa. ¿Qué hace ese interruptor? Cuando detecta una sobrecarga o un cortocircuito, se dispara automáticamente y corta la corriente. ¿Por qué? Para proteger toda la instalación eléctrica. Si no existiera, un cortocircuito en un enchufe podría incendiar toda la casa.

El circuit breaker en software hace exactamente lo mismo: cuando detecta que un servicio está fallando — el equivalente a un cortocircuito — corta las llamadas a ese servicio para proteger al resto del sistema. Sin él, un servicio fallando puede "incendiar" todo tu ecosistema de microservicios.

El patrón se ubica entre el cliente y el servicio, actuando como un proxy inteligente. El cliente llama al circuit breaker, y el circuit breaker decide si debe pasar la solicitud al servicio o rechazarla inmediatamente basándose en el estado de salud reciente del servicio.

---

## Slide 15 — ¿Por qué es importante? Parte 1 (3 minutos)

¿Por qué es tan importante este patrón? Veamos las primeras tres razones:

**Primero: Evita fallas en cascada.** Este es el beneficio número uno. Sin circuit breaker, si el servicio C falla, el servicio B se queda esperando la respuesta de C. Mientras espera, los threads de B se van agotando. Eventualmente B tampoco puede responder, y el servicio A que depende de B también se cae. Domino effect. Con circuit breaker, cuando B detecta que C no responde, abre el circuito y responde inmediatamente con un fallback. La falla queda contenida en C.

**Segundo: Libera recursos.** Sin circuit breaker, cuando un servicio está lento o caído, cada llamada ocupa un thread que se queda bloqueado esperando hasta que llega el timeout — que típicamente es de 30 o 60 segundos. Si tienes 200 threads y 200 solicitudes se quedan esperando, te quedas sin threads. Con circuit breaker en estado abierto, la respuesta es inmediata: "servicio no disponible". El thread se libera en milisegundos, no en segundos.

**Tercero: Permite recuperación.** Cuando un servicio está bajo presión o se está recuperando de un fallo, lo peor que puedes hacer es seguir bombardeándolo con solicitudes. Es como si alguien se está ahogando y tú le tiras más peso encima. El circuit breaker le da un respiro al servicio — deja de recibir tráfico por un rato, lo que le permite recuperarse. Cuando el timeout expira, envía solicitudes de prueba para verificar si ya se recuperó.

---

## Slide 16 — ¿Por qué es importante? Parte 2 (3 minutos)

**Cuarto: Mejora la experiencia del usuario.** Piénsenlo desde la perspectiva del cliente. ¿Qué prefieren: esperar 30 segundos a que un request haga timeout y luego ver un error genérico, o recibir en 50 milisegundos un mensaje como "Tu pedido fue recibido y será procesado en breve"? La segunda opción es infinitamente mejor, aunque técnicamente el servicio de fondo esté caído. El circuit breaker habilita este tipo de experiencia con respuestas fallback rápidas.

**Quinto: Observabilidad.** El circuit breaker actúa como un termómetro de la salud de tus dependencias. ¿El circuito del servicio de pagos se abrió? Eso te dice inmediatamente que algo anda mal con ese servicio. Puedes configurar alertas basadas en el estado del circuito. "Si el circuito se abre, notificar al equipo de pagos." Esto te da visibilidad sin tener que monitorear cada servicio individualmente.

**Sexto: Resiliencia del ecosistema.** El circuit breaker no solo protege a tu servicio — protege a todo el ecosistema de microservicios interconectados. Cuando un servicio falla y el circuito se abre, estás evitando que esa falla se propague por toda la malla de servicios. Es un acto de solidaridad arquitectónica: proteges a tus vecinos de tu propio fallo.

---

## Slide 17 — Analogía: Falla en Cascada vs Circuit Breaker (4 minutos)

Veamos esto de forma visual con nuestra demo interactiva.

**Escenario sin Circuit Breaker**: Tenemos una cadena típica — API Gateway → Servicio de Pagos → Servicio de Banco → Base de Datos de Transacciones.

La base de datos de transacciones deja de responder. Puede ser por un lock, un disco lleno, un problema de red — da igual la causa. El servicio de banco está intentando escribir una transacción pero no obtiene respuesta. Se queda esperando... 5 segundos, 10 segundos, 30 segundos. Mientras tanto, sus threads se van llenando con solicitudes pendientes.

El servicio de pagos está llamando al servicio de banco y tampoco obtiene respuesta. Sus threads también empiezan a bloquearse. La cola de requests crece. El API Gateway empieza a hacer timeout porque pagos no responde. Los usuarios ven una ruedita girando que nunca para.

En minutos, todo el sistema está caído. Un fallo en la base de datos derribó cuatro capas de servicios. Esto es la **falla en cascada**.

**Ahora el mismo escenario con Circuit Breaker**: La base de datos falla igual. El servicio de banco falla igual. Pero el servicio de pagos tiene un circuit breaker. Después de 5 llamadas fallidas al servicio de banco, el circuito se abre. A partir de ese momento, cualquier solicitud al servicio de banco recibe una respuesta inmediata: "CircuitBreakerOpenException".

El servicio de pagos, en vez de bloquearse, ejecuta su lógica de fallback: "El pago fue recibido y será procesado cuando el servicio esté disponible." El API Gateway recibe respuesta en milisegundos. El usuario ve un mensaje amigable. El sistema sigue funcionando.

¿Ven la diferencia? Con una sola adición — el circuit breaker en el servicio de pagos — contuvimos la falla y mantuvimos el sistema operativo.

*[Aquí pueden hacer la demo interactiva en la presentación]*

---

## Slide 18 — ¿Cómo funciona? - Diagrama de Estados (4 minutos)

Ahora entremos en el detalle técnico. El circuit breaker opera como una máquina de estados con tres estados posibles:

**CLOSED** (Cerrado): Este es el estado normal de operación. El circuito está cerrado, como un circuito eléctrico cerrado por donde fluye la corriente. Las solicitudes pasan libremente al servicio destino. Pero — y esto es clave — el circuit breaker no está dormido. Está monitoreando activamente cada respuesta: ¿fue exitosa? ¿falló? ¿fue lenta? Está acumulando métricas.

**OPEN** (Abierto): Cuando las métricas superan el umbral configurado — por ejemplo, más del 50% de las últimas 10 llamadas fallaron — el circuito se abre. Como un interruptor que se dispara. En estado abierto, todas las solicitudes son rechazadas inmediatamente sin siquiera intentar llamar al servicio. Esto es el fail-fast. La respuesta es instantánea: "No puedo atender esta solicitud porque el servicio está caído."

**HALF-OPEN** (Semi-abierto): Después de un tiempo configurable — digamos 30 segundos — el circuit breaker pasa a estado half-open. Es un estado de prueba. El circuito permite pasar un número limitado de solicitudes — por ejemplo 3 — para verificar si el servicio se ha recuperado. Es como tocar la puerta suavemente para ver si alguien responde, antes de enviar a toda la multitud.

Si esas solicitudes de prueba son exitosas, el circuito vuelve a CLOSED y la operación normal se retoma. Si fallan, vuelve a OPEN y se reinicia el timer.

*[Aquí pueden animar las transiciones con el botón de la presentación]*

---

## Slide 19 — ¿Cómo funciona? - Detalle del Flujo (3 minutos)

Veamos el flujo paso a paso con más detalle:

**Paso 1**: En estado CLOSED, el circuit breaker monitorea cada solicitud que pasa a través de él. Mantiene un registro — una sliding window(mecanismo que usa para evaluar el estado de salud de un servicio. Es básicamente un registro acotado de las últimas N llamadas o las llamadas en los últimos N segundos) — de los últimos N resultados. Cuenta cuántas fueron exitosas y cuántas fallidas. Mientras el ratio de error esté bajo el umbral, todo funciona transparentemente. El usuario del circuit breaker ni siquiera sabe que está ahí.

**Paso 2**: Cuando el porcentaje de fallos supera el umbral configurado — por ejemplo, si 6 de las últimas 10 llamadas fallaron y nuestro umbral es 50% — el circuito se abre. A partir de este momento, todas las solicitudes son rechazadas inmediatamente. Se lanza una excepción tipo `CircuitBreakerOpenException` o `CallNotPermittedException`. Esto permite al caller ejecutar su lógica de fallback sin esperar.

**Paso 3**: El circuit breaker inicia un timer. Cuando el timeout expira — por ejemplo después de 30 segundos — el circuito pasa automáticamente a HALF-OPEN. Ahora permite un número limitado de solicitudes de prueba. Es conservador: no abre la compuerta de golpe.

**Paso 4**: Si las solicitudes de prueba son exitosas, el circuit breaker concluye que el servicio se recuperó y cierra el circuito. Volvemos a la normalidad. Si las pruebas fallan, concluye que el servicio aún no se recupera, vuelve a OPEN y reinicia el timeout. Este ciclo se repite hasta que el servicio finalmente se recupere.

---

## Slide 20 — Enfoques de Funcionamiento (3 minutos)

Hay dos enfoques principales para evaluar cuándo abrir el circuito — es decir, cómo se define esa "sliding window" que mencioné:

**Count-based (por conteo)**: La sliding window tiene un tamaño fijo de N llamadas. Por ejemplo, las últimas 10 llamadas. Cada nueva llamada que se completa empuja a la más antigua fuera de la ventana. El circuit breaker calcula el porcentaje de fallos sobre esas 10 llamadas. Si configuras `failureRateThreshold: 50%` y `slidingWindowSize: 10`, el circuito se abrirá cuando 5 o más de las últimas 10 llamadas hayan fallado.

Este enfoque es predecible y fácil de razonar. Sabes exactamente cuántas llamadas se evalúan. Es bueno para servicios con tráfico constante.

**Time-based (por tiempo)**: La sliding window es un período de tiempo, no un conteo. Por ejemplo, los últimos 10 segundos. El circuit breaker evalúa todas las llamadas que se hicieron en ese período. Si configuras `failureRateThreshold: 50%` y `slidingWindowSize: 10` (segundos), el circuito se abrirá cuando más del 50% de las llamadas en los últimos 10 segundos hayan fallado.

Este enfoque es más reactivo a picos de errores repentinos. Es mejor para servicios con tráfico variable — si de repente llegan 100 solicitudes en 2 segundos y la mitad falla, lo detecta rápido.

¿Cuál elegir? Depende de tu caso. Count-based es el default más seguro y el que recomiendo empezar. Time-based es mejor cuando tienes tráfico muy variable o necesitas reaccionar más rápido a degradaciones.

---

## Slide 21 — Ventajas del Circuit Breaker (3 minutos)

Resumamos las ventajas principales del patrón:

**Previene fallas en cascada**: Ya lo vimos en detalle. Es la razón número uno por la que existe este patrón. Aísla el servicio problemático y evita que la falla se propague.

**Fail-fast**: Respuestas inmediatas en vez de esperar timeouts largos. Un thread que se libera en 5ms es mucho mejor que uno bloqueado 30 segundos. Esto mantiene la capacidad del sistema disponible para solicitudes que sí pueden ser atendidas.

**Libera recursos**: No mantiene threads ni conexiones bloqueadas esperando respuestas que no van a llegar. Esto es especialmente importante en Java donde los threads son costosos.

**Auto-recuperación**: Detecta automáticamente cuando el servicio vuelve a estar disponible gracias al mecanismo de half-open. No necesitas intervención manual ni reiniciar nada.

**Monitoreo integrado**: Los circuit breakers generan métricas valiosas: estado actual del circuito, tasa de fallos, tiempos de respuesta, cantidad de rechazos. Esto alimenta dashboards y alertas que te dan visibilidad sobre la salud del ecosistema.

**Fallback patterns**: Habilita respuestas alternativas como datos en caché, valores por defecto, o encolamiento para procesamiento posterior. El usuario nunca ve un error crudo.

---

## Slide 22 — Limitaciones del Circuit Breaker (3 minutos)

Pero seamos honestos — ningún patrón es perfecto. Las limitaciones que deben tener en cuenta:

**Complejidad adicional**: Cada circuit breaker es código que hay que mantener, configurar, y entender. En un sistema con 50 servicios, puedes tener cientos de circuit breakers. Necesitas convenciones claras y centralización de configuración.

**Tuning delicado**: Configurar mal los umbrales puede ser peor que no tener circuit breaker. Un umbral muy bajo abre el circuito con cualquier error transitorio. Un umbral muy alto no protege a tiempo. Encontrar el balance correcto requiere datos reales de producción y ajuste iterativo.

**Falsos positivos**: Un pico transitorio de errores — como un despliegue que tarda 5 segundos — puede abrir el circuito innecesariamente. Hay que configurar `minimumNumberOfCalls` y ventanas de evaluación adecuadas para minimizar esto.

**No resuelve la causa raíz**: El circuit breaker solo mitiga el impacto del fallo. Si tu base de datos tiene un problema de rendimiento, el circuit breaker evitará la cascada, pero no arregla la base de datos. Necesitas resolver el problema subyacente por separado.

**Testing complejo**: Probar todas las transiciones de estado, los edge cases del half-open, los fallbacks, y el comportamiento bajo concurrencia requiere tests bien pensados. No es trivial simular estos escenarios en unit tests.

---

## Slide 23 — Implementaciones Comunes (2 minutos)

Veamos rápidamente las implementaciones más populares en distintos lenguajes:

**Resilience4j** para Java 8+: Es el estándar actual. Modular, ligero, con soporte para programación funcional y reactiva. Incluye no solo circuit breaker sino también retry, rate limiter, bulkhead y time limiter.

**pybreaker** para Python: Simple, elegante, usa decoradores. Ideal para APIs de Flask o FastAPI.

**opossum** para Node.js: Basado en eventos, se integra bien con el modelo asíncrono de Node. Soporta Promises y callbacks.

**Polly** para .NET: Muy completo, permite combinar políticas de resiliencia de forma declarativa.

**gobreaker** para Go: Eficiente, concurrency-safe, diseñado para sistemas de alto rendimiento.

Y **Hystrix** de Netflix: Fue el pionero, pero ya está retirado. Si lo están usando en algún proyecto, es momento de planificar la migración a Resilience4j.

---

## Slide 24 — Ejemplo Práctico: Python (3 minutos)

Veamos un ejemplo concreto en Python usando pybreaker. Les voy a explicar cada parte:

Primero importamos `pybreaker` y `requests`. Luego creamos nuestra instancia de CircuitBreaker con tres configuraciones:

- `fail_max=5`: después de 5 fallos consecutivos, el circuito se abre.
- `reset_timeout=30`: después de 30 segundos en estado abierto, pasa a half-open.
- `exclude=[ValueError]`: las excepciones tipo ValueError no cuentan como fallo del servicio — son errores de validación nuestros, no del servicio externo.

Luego decoramos nuestra función con `@breaker`. Esto hace que cada llamada a `call_payment_service` sea monitoreada por el circuit breaker. Si la función lanza una excepción, cuenta como fallo. Si retorna normalmente, cuenta como éxito.

Finalmente, el uso con fallback: envolvemos la llamada en un try/except. Si el circuit breaker lanza `CircuitBreakerError` — lo que significa que el circuito está abierto — ejecutamos nuestra lógica de fallback. En este caso, retornamos un objeto indicando que el pago fue encolado para procesamiento posterior.

Lo elegante de pybreaker es que con solo un decorador y unas pocas líneas de configuración, protegemos toda una ruta de llamadas externas.

---

## Slide 25 — Ejemplo Práctico: Java (3 minutos)

Ahora veamos el mismo concepto en Java con Resilience4j, que es más verboso pero también más flexible:

Primero configuramos el CircuitBreaker con `CircuitBreakerConfig`:
- `failureRateThreshold(50)`: si el 50% de las llamadas fallan, se abre.
- `waitDurationInOpenState(30 seconds)`: espera 30 segundos antes de pasar a half-open.
- `slidingWindowSize(10)`: evalúa las últimas 10 llamadas.
- `permittedNumberOfCallsInHalfOpenState(3)`: permite 3 llamadas de prueba en half-open.

Luego creamos la instancia del CircuitBreaker con un nombre identificador — útil para métricas y logging.

Decoramos nuestro Supplier con `CircuitBreaker.decorateSupplier()`. Esto envuelve la llamada a `paymentService.process(order)` con la lógica del circuit breaker.

Finalmente, ejecutamos con `Try.ofSupplier()` que nos permite encadenar handlers de recuperación:
- Si el circuito está abierto (`CallNotPermittedException`), retornamos un mensaje amigable.
- Si hay cualquier otra excepción, retornamos un error con el mensaje.

En un proyecto Spring Boot real, mucha de esta configuración se hace vía properties y anotaciones, pero el concepto subyacente es el mismo.

---

## Slide 26 — Parámetros de Configuración (3 minutos)

Veamos los parámetros clave que necesitan entender para configurar un circuit breaker en producción:

**failureRateThreshold** (típico: 50%): El porcentaje de fallos necesario para abrir el circuito. 50% es un buen punto de partida, pero ajústenlo según la criticidad del servicio. Para servicios críticos podrían bajarlo a 30%.

**slidingWindowSize** (típico: 10-100): El tamaño de la ventana de evaluación. Más grande = más estable pero más lento para reaccionar. Más pequeño = más reactivo pero más propenso a falsos positivos.

**slidingWindowType**: COUNT_BASED o TIME_BASED. Ya los discutimos. COUNT_BASED es el default recomendado.

**waitDurationInOpenState** (típico: 30-60s): Cuánto tiempo permanece abierto antes de intentar half-open. Debe ser suficiente para que el servicio se recupere. Si es muy corto, vuelves a intentar demasiado pronto. Si es muy largo, tardas en recuperar funcionalidad.

**permittedCallsInHalfOpen** (típico: 3-10): Cuántas solicitudes de prueba envías en half-open. Pocas = más conservador pero tardas más en confirmar recuperación. Muchas = confirmas más rápido pero si el servicio aún no está bien, lo presionas.

**slowCallDurationThreshold** (típico: 2-5s): Umbral para considerar una llamada como "lenta". Las llamadas lentas también cuentan para abrir el circuito, porque un servicio lento es casi tan dañino como uno caído — consume threads.

**slowCallRateThreshold** (típico: 80-100%): Porcentaje de llamadas lentas para abrir. Generalmente lo pones alto para no ser demasiado agresivo con latencia variable.

**minimumNumberOfCalls** (típico: 10-20): Mínimo de llamadas necesarias antes de empezar a evaluar. Evita que el circuito se abra con las primeras 2-3 llamadas que casualmente fallaron.

Mi recomendación: empiecen con los valores típicos, monitoreen el comportamiento en producción, y ajusten iterativamente. No intenten afinar estos valores en ambiente de desarrollo — necesitan tráfico real.

---

## Slide 27 — Simulador y Cierre (5 minutos)

Para cerrar esta presentación, les quiero dejar un simulador interactivo donde pueden experimentar con todo lo que hemos hablado.

*[Demostrar el simulador]*

Pueden ajustar:
- El umbral de fallos: con cuántos errores se abre el circuito.
- El timeout: cuánto tiempo permanece abierto.
- La probabilidad de fallo: simula un servicio más o menos inestable.

Les recomiendo probar estos escenarios:
1. Pongan la probabilidad de fallo en 80% y envíen un burst de 10 requests. Van a ver cómo el circuito se abre rápidamente.
2. Luego bajen la probabilidad a 20% y esperen el timeout. Van a ver la transición a half-open y la recuperación.
3. Prueben con umbral de 1 y vean cómo un solo error abre el circuito — esto es un umbral demasiado agresivo.

*[Dar tiempo para que experimenten]*

---

## Mensaje Final

Quiero cerrarles con una reflexión. El Circuit Breaker no es solo un patrón de diseño ni una librería que instalas y te olvidas. Es una **filosofía de ingeniería**:

> Acepta que los fallos van a ocurrir — porque en sistemas distribuidos son inevitables — y prepárate para ellos.

Tu sistema no necesita ser perfecto. No necesita tener 100% de uptime — eso no existe. Lo que necesita es ser **resiliente**: capaz de absorber el impacto de un fallo, proteger al resto del ecosistema, y recuperarse automáticamente.

Si se llevan solo tres cosas de esta presentación, que sean estas:
1. **Diseñen para el fallo**, no contra el fallo.
2. **Fail-fast es mejor que fail-slow** — un error rápido es mejor que una espera eterna.
3. **Implementen circuit breakers** en cada llamada a servicios externos. Es una inversión pequeña con un retorno enorme.

Muchas gracias por su tiempo y atención. Quedamos abiertos a preguntas.

— **Angel Duran & Daniel Felipe Melo**

---

*Tiempo estimado por sección:*
- *Portada + Agenda: ~7 min*
- *Resiliencia (slides 4-13): ~35 min*
- *Circuit Breaker (slides 14-26): ~33 min*
- *Simulador + Cierre: ~5 min*
- *Total: ~65 minutos (1h 5min)*
