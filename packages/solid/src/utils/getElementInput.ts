import type {
  FieldElement,
  FieldPath,
  FieldPathValue,
  FieldValues,
  Maybe,
} from '@modular-forms/shared';
import type { FieldStore, FieldType, FieldValue } from '../types';

/**
 * Returns the current input of the element.
 *
 * @param element The field element.
 *
 * @returns The element input.
 */
export function getElementInput<
  TFieldValues extends FieldValues<FieldValue>,
  TFieldName extends FieldPath<TFieldValues, FieldValue>
>(
  element: FieldElement,
  field: FieldStore<TFieldValues, TFieldName>,
  type: Maybe<FieldType<any>>
): FieldPathValue<TFieldValues, TFieldName, FieldValue> {
  const { checked, files, options, value, valueAsDate, valueAsNumber } =
    element as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
  return (
    !type || type === 'string'
      ? value
      : type === 'string[]'
      ? options
        ? [...options]
            .filter((e) => e.selected && !e.disabled)
            .map((e) => e.value)
        : checked
        ? [...((field.value || []) as string[]), value]
        : ((field.value || []) as string[]).filter((v) => v !== value)
      : type === 'number'
      ? valueAsNumber
      : type === 'boolean'
      ? checked
      : type === 'File' && files
      ? files[0]
      : type === 'File[]' && files
      ? [...files]
      : type === 'Date' && valueAsDate
      ? valueAsDate
      : field.value
  ) as FieldPathValue<TFieldValues, TFieldName, FieldValue>;
}
