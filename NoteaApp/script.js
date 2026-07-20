const notesContainer = document.getElementById("notesContainer");
const createBtn = document.getElementById("createBtn");
const saveStatus = document.getElementById("saveStatus");
const noteCount = document.getElementById("noteCount");

function formatTimestamp() {
    return new Date().toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}

function updateStatus(message) {
    saveStatus.textContent = message;
    clearTimeout(updateStatus.timeout);
    updateStatus.timeout = setTimeout(() => {
        saveStatus.textContent = "Ready to write";
    }, 1200);
}

function updateCount() {
    const count = notesContainer.querySelectorAll(".note-card").length;
    noteCount.textContent = `${count} note${count === 1 ? "" : "s"}`;
}

function createNoteCard(title = "", content = "", createdAt = formatTimestamp()) {
    const card = document.createElement("article");
    card.className = "note-card";
    card.dataset.createdAt = createdAt;

    card.innerHTML = `
        <button class="delete-btn" type="button" aria-label="Delete note">
            <img src="images/delete.png" alt="delete icon">
        </button>
        <textarea class="note-title" placeholder="Title" rows="1">${title}</textarea>
        <textarea class="note-content" placeholder="Start typing...">${content}</textarea>
        <div class="note-footer">
            <span>${createdAt}</span>
            <span>Auto-save</span>
        </div>
    `;

    return card;
}

function saveNotes() {
    const notes = Array.from(notesContainer.querySelectorAll(".note-card")).map((card) => ({
        title: card.querySelector(".note-title").value.trim(),
        content: card.querySelector(".note-content").value,
        createdAt: card.dataset.createdAt
    }));

    localStorage.setItem("notes", JSON.stringify(notes));
    updateStatus("Saved");
    updateCount();
}

function renderNotes() {
    const savedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
    notesContainer.innerHTML = "";

    if (!savedNotes.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = "<h3>No notes yet</h3><p>Create your first note and it will appear here.</p>";
        notesContainer.appendChild(emptyState);
        updateCount();
        return;
    }

    savedNotes.forEach((note) => {
        notesContainer.appendChild(createNoteCard(note.title, note.content, note.createdAt));
    });

    updateCount();
}

createBtn.addEventListener("click", () => {
    const card = createNoteCard();
    notesContainer.querySelector(".empty-state")?.remove();
    notesContainer.appendChild(card);
    card.querySelector(".note-title").focus();
    saveNotes();
});

notesContainer.addEventListener("input", (event) => {
    if (event.target.matches(".note-title, .note-content")) {
        saveNotes();
    }
});

notesContainer.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-btn");
    if (!deleteButton) return;

    deleteButton.closest(".note-card").remove();
    saveNotes();

    if (!notesContainer.querySelectorAll(".note-card").length) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = "<h3>No notes yet</h3><p>Create your first note and it will appear here.</p>";
        notesContainer.appendChild(emptyState);
    }
});

renderNotes();