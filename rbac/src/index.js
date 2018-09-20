import * as rbac from './rbac'

(
    async () => {
        try {
            await rbac.createApp()
        } catch (ex) {
            console.error(ex)
        }       
    }
)()