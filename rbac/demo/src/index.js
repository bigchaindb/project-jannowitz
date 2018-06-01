import * as transUtils from './rbac'

(
    async () => {
        try {
            await transUtils.createApp()
        } catch (ex) {
            // TODO - handle error
        }
    }
)
