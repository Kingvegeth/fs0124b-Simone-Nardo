package it.epicode.app;

import it.epicode.library.dao.*;
import it.epicode.library.entities.*;
import it.epicode.library.entities.enums.Frequency;
import it.epicode.library.services.IsbValidatorImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

public class Program {

	private static final Logger log = LoggerFactory.getLogger(Program.class);

	public static void main(String[] args) {
		IsbValidatorImpl isbnValidator = new IsbValidatorImpl();
		LibraryItemDaoImpl libraryItemDao = new LibraryItemDaoImpl();
		LoanDao loanDao = new LoanDaoImpl();
		UserDaoImpl userDao = new UserDaoImpl();

		// Menu
		Scanner scanner = new Scanner(System.in);
		int choice;
		do {
			System.out.println("Menu Principale:");
			System.out.println("1. Gestione Elementi");
			System.out.println("2. Gestione Prestiti");
			System.out.println("0. Esci");
			System.out.print("Scelta: ");
			choice = scanner.nextInt();

			switch (choice) {
				case 1:
					manageItemsMenu(libraryItemDao, isbnValidator);
					break;
				case 2:
					manageLoansMenu(loanDao, userDao);
					break;
				case 0:
					System.out.println("Uscita...");
					break;
				default:
					System.out.println("Scelta non valida!");
			}
		} while (choice != 0);
		scanner.close();
	}

	private static void manageItemsMenu(LibraryItemDao libraryItemDao, IsbValidatorImpl isbnValidator) {
		Scanner scanner = new Scanner(System.in);
		int choice;
		do {
			System.out.println("Menu Gestione Elementi:");
			System.out.println("1. Aggiungi elemento al catalogo");
			System.out.println("2. Rimuovi elemento dal catalogo dato un codice ISBN");
			System.out.println("3. Ricerca per ISBN");
			System.out.println("4. Ricerca per anno di pubblicazione");
			System.out.println("5. Ricerca per autore");
			System.out.println("6. Ricerca per titolo");
			System.out.println("7. Visualizza tutti gli elementi nel catalogo");
			System.out.println("0. Torna al Menu Principale");
			System.out.print("Scelta: ");
			choice = scanner.nextInt();

			switch (choice) {
				case 1:
					addLibraryItem(libraryItemDao, isbnValidator);
					break;
				case 2:
					removeLibraryItem(libraryItemDao);
					break;
				case 3:
					searchByISBN(libraryItemDao);
					break;
				case 4:
					searchByPublicationYear(libraryItemDao);
					break;
				case 5:
					searchByAuthor(libraryItemDao);
					break;
				case 6:
					searchByTitle(libraryItemDao);
					break;
				case 7:
					displayAllItems(libraryItemDao);
					break;
				case 0:
					System.out.println("Tornando al Menu Principale...");
					break;
				default:
					System.out.println("Scelta non valida!");
			}
		} while (choice != 0);
	}

	private static void manageLoansMenu(LoanDao loanDao, UserDao userDao) {
		Scanner scanner = new Scanner(System.in);
		int choice;
		do {
			System.out.println("Menu Gestione Prestiti:");
			System.out.println("1. Aggiungi un utente");
			System.out.println("2. Aggiungi un prestito");
			System.out.println("3. Ricerca degli elementi attualmente in prestito dato un numero di tessera utente");
			System.out.println("4. Ricerca di tutti i prestiti scaduti e non ancora restituiti");
			System.out.println("0. Torna al Menu Principale");
			System.out.print("Scelta: ");
			choice = scanner.nextInt();

			switch (choice) {
				case 1:
					addUser((UserDaoImpl) userDao);
					break;
				case 3:
					searchLoansByTessera(loanDao);
					break;
				case 4:
					searchOverdueLoans(loanDao);
					break;
				case 0:
					System.out.println("Tornando al Menu Principale...");
					break;
				default:
					System.out.println("Scelta non valida!");
			}
		} while (choice != 0);
	}

	private static void addLibraryItem(LibraryItemDao libraryItemDao, IsbValidatorImpl isbnValidator) {
		Scanner scanner = new Scanner(System.in);
		try {
			System.out.println("Inserisci i dettagli del nuovo elemento:");
			System.out.print("ISBN: ");
			String isbn = scanner.nextLine();
			System.out.print("Titolo: ");
			String title = scanner.nextLine();
			System.out.print("Anno di pubblicazione: ");
			int publicationYear = scanner.nextInt();
			System.out.print("Numero di pagine: ");
			int pages = scanner.nextInt();
			scanner.nextLine();

			System.out.println("Seleziona il tipo di elemento:");
			System.out.println("1. Libro");
			System.out.println("2. Rivista");
			System.out.print("Scelta: ");
			int elementType = scanner.nextInt();
			scanner.nextLine();

			LibraryItem newItem = null;
			if (elementType == 1) {
				System.out.print("Autore: ");
				String author = scanner.nextLine();
				System.out.print("Genere: ");
				String genre = scanner.nextLine();
				newItem = new Book(isbn, title, publicationYear, pages, author, genre);
			} else if (elementType == 2) {
				System.out.println("Seleziona la periodicità:");
				for (Frequency frequency : Frequency.values()) {
					System.out.println(frequency.ordinal() + 1 + ". " + frequency);
				}
				System.out.print("Scelta: ");
				int frequencyChoice = scanner.nextInt();
				Frequency frequency = Frequency.values()[frequencyChoice - 1];
				newItem = new Magazine(isbn, title, publicationYear, pages, frequency);
			} else {
				System.out.println("Tipo di elemento non valido! Elemento non aggiunto.");
				return;
			}

			if (isbnValidator.isValidIsbn(isbn)) {
				libraryItemDao.addItem(newItem);
				log.debug("Elemento aggiunto al catalogo: {}", newItem);
			} else {
				System.out.println("ISBN non valido! Elemento non aggiunto.");
			}
		} catch (Exception e) {
			log.error("Errore durante l'aggiunta dell'elemento al catalogo", e);
		}
	}


	private static void removeLibraryItem(LibraryItemDao libraryItemDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci il codice ISBN dell'elemento da rimuovere: ");
		String isbnToRemove = scanner.nextLine();
		libraryItemDao.removeItemByISBN(isbnToRemove);
		log.debug("Elemento rimosso dal catalogo con ISBN: {}", isbnToRemove);
	}

	private static void searchByISBN(LibraryItemDao libraryItemDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci il codice ISBN da cercare: ");
		String isbnToSearch = scanner.nextLine();
		LibraryItem foundItem = libraryItemDao.getItemByISBN(isbnToSearch);
		if (foundItem != null) {
			log.debug("Elemento trovato con ISBN {}: {}", isbnToSearch, foundItem);
		} else {
			log.debug("Nessun elemento trovato con ISBN {}", isbnToSearch);
		}
	}

	private static void searchByPublicationYear(LibraryItemDao libraryItemDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci l'anno di pubblicazione da cercare: ");
		int yearToSearch = scanner.nextInt();
		List<LibraryItem> itemsByYear = libraryItemDao.getItemsByPublicationYear(yearToSearch);
		log.debug("Elementi trovati per anno di pubblicazione {}: {}", yearToSearch, itemsByYear);
	}

	private static void searchByAuthor(LibraryItemDao libraryItemDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci l'autore da cercare: ");
		String authorToSearch = scanner.nextLine();
		List<LibraryItem> itemsByAuthor = libraryItemDao.getItemsByAuthor(authorToSearch);
		log.debug("Elementi trovati per autore {}: {}", authorToSearch, itemsByAuthor);
	}

	private static void searchByTitle(LibraryItemDao libraryItemDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci il titolo o parte di esso da cercare: ");
		String titleToSearch = scanner.nextLine();
		List<LibraryItem> itemsByTitle = libraryItemDao.getItemsByTitle(titleToSearch);
		log.debug("Elementi trovati per titolo {}: {}", titleToSearch, itemsByTitle);
	}

	private static void displayAllItems(LibraryItemDao libraryItemDao) {
		List<LibraryItem> allItems = libraryItemDao.getAllItems();
		if (allItems.isEmpty()) {
			System.out.println("Nessun elemento nel catalogo.");
		} else {
			System.out.println("Elementi nel catalogo:");
			for (LibraryItem item : allItems) {
				System.out.println(item);
			}
		}
	}

	private static void addUser(UserDaoImpl userDao) {
		Scanner scanner = new Scanner(System.in);
		try {
			System.out.println("Aggiungi un utente:");
			System.out.print("Nome: ");
			String nome = scanner.nextLine();
			System.out.print("Cognome: ");
			String cognome = scanner.nextLine();
			System.out.print("Data di nascita (formato yyyy-MM-dd): ");
			String dataDiNascitaStr = scanner.nextLine();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date dataDiNascita = sdf.parse(dataDiNascitaStr);
			System.out.print("Numero tessera: ");
			int numeroTessera = scanner.nextInt();

			User newUser = new User(nome, cognome, dataDiNascita, numeroTessera);
			userDao.addUser(newUser);
			log.debug("Utente aggiunto: {}", newUser);
		} catch (Exception e) {
			log.error("Errore durante l'aggiunta dell'utente", e);
		}
	}
	
	
	private static void searchLoansByTessera(LoanDao loanDao) {
		Scanner scanner = new Scanner(System.in);
		System.out.print("Inserisci il numero di tessera utente: ");
		int tesseraNumber = scanner.nextInt();
		List<Loan> loansByTessera = loanDao.getLoansByUserTessera(tesseraNumber);
		log.debug("Prestiti trovati per il numero di tessera {}: {}", tesseraNumber, loansByTessera);
	}

	private static void searchOverdueLoans(LoanDao loanDao) {
		List<Loan> overdueLoans = loanDao.getOverdueLoans();
		log.debug("Prestiti scaduti e non ancora restituiti: {}", overdueLoans);
	}
}