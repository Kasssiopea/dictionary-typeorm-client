# npu-libraries-dictionary-typeorm-client



## Getting started

Бібліотека створенна  на ```TypeScript``` version ```"^5.1.6"```.
Ця бібліотека була створенна для обробки данних з використанням бібліотеки [npu-libraries-dictionary-client](https://git.in.np.gov.ua/npu-libraries/dictionary/npu-libraries-dictionary-client.git).

## Installation
Для встановлення бібліотеки потрібно:
- [ ] Створити файл під назвою ```.npmrc``` в корені проекту.
- [ ] Налаштувати цей файл.
- ```
  strict-ssl=false
  registry=https://npm-registry.in.np.gov.ua
  ```
- [ ] Проінсталювати бібліотеку.
- ```
    npm install @npu-libs/dictionary-typeorm-client
  ```

## Using
Використання 
```
@Entity({ schema: '*****', name: '*****' })
export class WantedCars {
    @Column('varchar2', { nullable: false, primary: true, length: 20, name: 'ID' })
    id: string;
    
    @Column('varchar2', { nullable: false, length: 3, name: 'CATEGORY' })
    category: string;
    
    Other code....
}
```
Це модель БД.
Після отримання Entity потрібно створити 
```
const objWithDictMeta: ObjWithDictMeta = {
    _dicts: {
      category: 'GARPUN_PZ',
    },
    ...entity,
} as any;
```
Опис
```
category - назва поля entity
GARPUN_PZ - назва словаря
entity - отримана entity з БД
```
Запуск
```
const dictManager = new DictManager({
baseURL: 'https://develop.api.in.np.gov.ua/v1/directory/dictionaries/review',
});

const transformToDict = transformToDictInit(dictManager);
const transformedObject = transformToDict(objWithDictMeta);

const transformed = await transformedObject;
```
Весь код
```
const objWithDictMeta: ObjWithDictMeta = {
    _dicts: {
      category: 'GARPUN_PZ',
    },
    ...entity,
} as any;
const dictManager = new DictManager({
baseURL: 'https://develop.api.in.np.gov.ua/v1/directory/dictionaries/review',
});

const transformToDict = transformToDictInit(dictManager);
const transformedObject = transformToDict(objWithDictMeta);

const transformed = await transformedObject;
```
Отриманий результат 
```
{
    id: '3023227590050020',
    category: {
        key: '204',
        value: 'РОЗШУК ТЗ ЗА ІНШИМИ КРИМІНАЛЬНИМИ ПРАВОПОРУШ.'
    },
    Other response....
}

```