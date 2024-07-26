# Prueba de diferentes hashes (alternativas a bcrypt normal)

# Argon2:

El hash generado por Argon2 incluye varios componentes, incluyendo un identificador al principio. La estructura típica de un hash de Argon2 es la siguiente:

```
$argon2id$v=19$m=65536,t=3,p=4$[salt]$[hash]
```

Vamos a desglosar esto:

1. `$argon2id$`: Este es el identificador del algoritmo. Puede ser `argon2i`, `argon2d`, o `argon2id`, dependiendo de la variante de Argon2 utilizada.

2. `v=19`: Indica la versión del algoritmo.

3. `m=65536,t=3,p=4`: Son los parámetros de configuración:
   - `m` es la memoria utilizada (en KiB)
   - `t` es el número de iteraciones
   - `p` es el grado de paralelismo

4. `[salt]`: Es la sal utilizada, codificada en base64.

5. `[hash]`: Es el hash final, también codificado en base64.

Esta estructura permite que Argon2 almacene toda la información necesaria para verificar la contraseña posteriormente, incluyendo la sal y los parámetros utilizados. Esto es similar a cómo bcrypt incluye la información del salt en su hash.

Cuando se verifica una contraseña con Argon2, el algoritmo puede extraer toda esta información del hash almacenado para recrear las mismas condiciones y verificar si la contraseña ingresada produce el mismo resultado.

Esta estructura hace que los hashes de Argon2 sean autocontenidos y seguros, ya que incluyen toda la información necesaria para la verificación sin comprometer la seguridad del hash en sí.

# bcrypt js

Un hash típico de bcrypt se ve así:

```
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

Vamos a desglosarlo:

1. `$2a$`: Este es el identificador del algoritmo. 
   - `2a` indica la versión de bcrypt utilizada. Otras variantes pueden ser `2b` o `2y`.

2. `10$`: Este es el costo o número de rondas. En este caso, 10.
   - El costo determina cuánto tiempo tomará generar el hash. Un número más alto hace que el proceso sea más lento y resistente a ataques de fuerza bruta.

3. `N9qo8uLOickgx2ZMRZoMye`: Esta es la sal, que tiene 22 caracteres.
   - La sal es única para cada hash y ayuda a prevenir ataques con tablas rainbow.

4. `IjZAgcfl7p92ldGxad68LJZdL17lhWy`: Esta es la parte del hash real de la contraseña.

Toda esta información está codificada en un solo string, lo que hace que los hashes de bcrypt sean autocontenidos, al igual que los de Argon2.

Cuando bcrypt verifica una contraseña, puede extraer la sal y el costo directamente del hash almacenado, aplicar estos parámetros a la contraseña proporcionada, y luego comparar el resultado con la parte del hash almacenado.

Esta estructura permite que bcrypt almacene toda la información necesaria para la verificación en un solo string, sin necesidad de almacenar la sal o el costo por separado. Esto simplifica el almacenamiento y la verificación de contraseñas, a la vez que mantiene un alto nivel de seguridad.

# scrypt

El formato de salida de scrypt es un poco diferente a bcrypt y Argon2, y no tiene un formato estándar universalmente adoptado. Sin embargo, para mantener toda la información necesaria para la verificación, generalmente se crea una cadena que incluye todos los parámetros necesarios. Aquí te muestro un formato común:

```
$scrypt$N=16384,r=8,p=1$salt$hash
```

Desglosamos esto:

1. `$scrypt$`: Identificador del algoritmo.

2. `N=16384,r=8,p=1`: Parámetros de scrypt:
   - `N`: Factor de costo CPU/memoria (debe ser una potencia de 2)
   - `r`: Parámetro de bloque
   - `p`: Factor de paralelización

3. `salt`: La sal utilizada, generalmente codificada en base64.

4. `hash`: El hash resultante, también codificado en base64.

Sin embargo, es importante notar que este formato no es un estándar oficial como en el caso de bcrypt o Argon2. En el ejemplo proporcionado anteriormente con el módulo `crypto` de Node.js, utilizamos un formato simplificado:

```javascript
salt + ':' + derivedKey.toString('hex')
```

Donde simplemente concatenamos la sal y el hash derivado con dos puntos como separador.

Cuando se usa scrypt, a menudo es responsabilidad del desarrollador decidir cómo almacenar estos parámetros junto con el hash. Podrías optar por almacenar los parámetros `N`, `r`, y `p` por separado en la base de datos, o incluirlos en la cadena del hash de alguna manera.

Por ejemplo, podria crearse una función para generar un hash en este formato:

```javascript
function scryptHash(password, salt, N, r, p) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, { N, r, p }, (err, derivedKey) => {
            if (err) reject(err);
            resolve(`$scrypt$N=${N},r=${r},p=${p}$${salt}$${derivedKey.toString('hex')}`);
        });
    });
}
```

Y una función correspondiente para verificar:

```javascript
function verifyScrypt(password, fullHash) {
    const [, , params, salt, hash] = fullHash.split('$');
    const [N, r, p] = params.split(',').map(param => parseInt(param.split('=')[1]));
    
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, { N, r, p }, (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex') === hash);
        });
    });
}
```

Esta aproximación permite almacenar todos los parámetros necesarios en una sola cadena, similar a cómo funcionan bcrypt y Argon2, pero no debemos olvidar que no es un estándar oficial y deberiamos documentar bien la implementación si decidimos usar este enfoque.