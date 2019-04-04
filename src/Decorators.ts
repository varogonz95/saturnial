import { GenericPropertyDecorator, METADATA_KEYS } from "./Utils";
import { ActionBindingOptions } from "./interfaces";

const DEFAULT_BINDING_OPTIONS: ActionBindingOptions = { params: null }

export function action(options?: ActionBindingOptions): GenericPropertyDecorator<void> {
    return (target: any, propertyKey: string) => {
        Reflect.defineMetadata(METADATA_KEYS.ACTION_PARAMS, options || DEFAULT_BINDING_OPTIONS, target, propertyKey)
    }
}