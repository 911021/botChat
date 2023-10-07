require("dotenv").config();
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')

const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')

// Define primero flowMensaje
const flowMensaje = addKeyword('hola')
    .addAnswer(
        'Aqui va un mensaje',
        {
            capture: true,
        },
        async (ctx, {provider}) => {
            await provider.sendtext(17862968890, 'mensaje')
        }
    )

// Luego define flowPrincipal con flowMensaje
const flowPrincipal = addKeyword(['test', 'te', 't'])
    .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
    .addAnswer(
        [
            'te comparto los siguientes links de interes sobre el proyecto',
            '👉 *doc* para ver la documentación',
            '👉 *gracias*  para ver la lista de videos',
            '👉 *discord* unirte al discord',
        ],
        null,
        null,
        [flowMensaje] // Ahora puedes referenciar flowMensaje correctamente
    )

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: process.env.JWTOKEN,
        numberId: process.env.NUMBER_ID,
        verifyToken: process.env.VERIFY_TOKEN,
        version: 'v18.0',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
