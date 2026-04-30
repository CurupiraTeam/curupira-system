export class ExampleService {
  static async getHello() {
    // In a real scenario, this would call your back-end API
    return "Hello from Curupira Front-end Service!";
  }

  static async createItem(data: { name: string }) {
    console.log("Creating item:", data);
    return { success: true, data };
  }
}
