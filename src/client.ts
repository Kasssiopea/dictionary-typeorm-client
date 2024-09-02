import {ObjWithDictMeta, ObjectWithDict, Entries, KeyValuePairOrNull} from './types';
import { DictManager } from '@npu-libs/dictionary-client';
import { getMetadataArgsStorage } from 'typeorm';

// TEST - 3  One of the best. Вроде правильно
export function transformToDictInit(dictManager: DictManager) {
  return async function transformToDict<T extends ObjWithDictMeta>(
      instance: T, 
      className: string = instance.constructor.name,
    ): Promise<ObjectWithDict<T>> {
    const result: ObjectWithDict<T> = {} as ObjectWithDict<T>;
    const relations = getMetadataArgsStorage().filterRelations(className); 

    const { _dicts } = instance;
    const entries = Object.entries(instance) as Entries<T>;

    for (const [key, value] of entries) {
      if (key === '_dicts') {
        continue;
      }

      const relation = relations.find(({ propertyName }) => propertyName === key);

      if (_dicts !== undefined && key in _dicts) {
        const keyValue = await dictManager.getKeyValuePairByKey(value, _dicts[key as keyof T['_dicts'] as string]);
        result[key] = keyValue as ObjectWithDict<T>[keyof T];
        
      } else if (relation !== undefined) {
        if (!value) continue;

        const relationClassName = typeof relation.target === 'string' 
          ? relation.target 
          : relation.target.constructor.name;

        if (Array.isArray(value)) {
          // @ts-ignore
          result[key] = await Promise.all(value.map(async (v) => transformToDict(v, relationClassName))) as any;
        } else if (typeof value === 'object' && value !== null) {
          result[key] = await transformToDict(value, relationClassName) as ObjectWithDict<T>[keyof T];
        } else {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  };
}






