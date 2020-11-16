import StorageService from './storage.service';
import ImportService from './import.service';

export const getImportService = () => {
  const storageService = new StorageService()
  return new ImportService(storageService)
}
