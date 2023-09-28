import { Filter, getFirestore } from 'firebase-admin/firestore';

/**
 * Repository to save and get documents from firestore
 *
 * This is the repository that will be used to save the documents in firestore
 * after the user authorizes the app to access their profile and documents.
 */
export default class DocumentRepository {
  private readonly collection: FirebaseFirestore.CollectionReference;

  constructor(private readonly firestore = getFirestore()) {
    this.collection = this.firestore.collection('documents');
  }

  async save(userId: string, data: DocumentSave) {
    await this.collection
      .doc(userId)
      .collection('documents')
      .doc(data.id)
      .set(data, {
        merge: true,
      });
  }

  async get(userId: string, id: string): Promise<Document | undefined> {
    const document = await this.collection
      .doc(userId)
      .collection('documents')
      .doc(id)
      .get();

    return document.data() as Document;
  }

  async delete(userId: string, id: string) {
    await this.collection.doc(userId).collection('documents').doc(id).delete();
  }

  async getMany(userId: string): Promise<DocIdTitle[]> {
    const documents = await this.collection
      .doc(userId)
      .collection('documents')
      .select('id', 'title')
      .get();

    return documents.docs.map((doc) => ({
      id: doc.data().id,
      title: doc.data().title,
    }));
  }

  async getEmptyWebhooks(userId: string): Promise<Document[]> {
    const date = new Date();
    const documents = await this.collection
      .doc(userId)
      .collection('documents')
      .where(
        Filter.or(
          Filter.where('webhook', '==', undefined),
          Filter.where('webhook.expiration', '<', date.getTime()),
        ),
      )
      .get();

    return documents.docs.map((doc) => doc.data() as Document);
  }
}

export interface DocumentSave extends Partial<Document> {
  id: string;
}

export interface Document {
  id: string;
  title: string;
  markdown: string;

  webhook?: {
    expiration: string;
    id: string;
    resourceId: string;
  };
}

type DocIdTitle = Omit<Document, 'markdown'>;
