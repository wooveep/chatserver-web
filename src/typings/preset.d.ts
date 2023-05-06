import { namespace } from "naive-ui/es/_utils/cssr"

declare namespace Preset{
	interface Preset{
		preset_id:string
		preset_name: string
	}
    interface PresetStore{
        active: string
        list: Preset[]
    }
}
