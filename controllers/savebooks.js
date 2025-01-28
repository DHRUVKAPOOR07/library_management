import Book from "../models/book-schema.js";
const saveBooks = async (books) => {
  try {
    const savedBooks = await Book.insertMany(books);
    console.log("Books saved successfully:", savedBooks);
  } catch (error) {
    console.error("Error saving books:", error);
  }
};
const booksToStore = [
  {
    title: "Book Title 1",
    author: "Author 1",
    category: "Category 1",
    publishedDate: new Date("2024-06-09"),
    availableCopies: 2,
    totalCopies: 2,
  },
  {
    title: "Book Title 2",
    author: "Author 2",
    category: "Category 2",
    publishedDate: new Date("2024-06-07"),
    availableCopies: 1,
    totalCopies: 1,
  },
];
export default saveBooks(booksToStore);
