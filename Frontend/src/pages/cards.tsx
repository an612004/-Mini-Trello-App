import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import "../styles/cards.scss";
import cardsService from "../services/cardsService";
import tasksService from "../services/tasksService";
import TopBar from "../components/TopBar";
import Sidebar from "../components/Sidebar";
import Invite from "../components/Invite";

// Types
interface Card {
    id?: string;
    name: string;
    description?: string;
    ownerId: string;
    list_member: string[];
    tasks_count: number;
    createdAt?: any;
}

interface List {
    title: string;
    cards: Card[];
}


const Cards: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const navigate = useNavigate();

    const [cards, setCards] = useState<Card[]>([]);
    const [lists, setLists] = useState<List[]>([]);
    const [newCardInputs, setNewCardInputs] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [showAddList, setShowAddList] = useState(false);
    const [newListTitle, setNewListTitle] = useState("");

    // Fetch cards from API
    const fetchCards = async () => {
        if (!boardId) return;
        setLoading(true);
        try {
            const data = await cardsService.getAll(boardId);
            setCards(data.cards);
        } catch (error) {
            console.error("Failed to fetch cards:", error);
        } finally {
            setLoading(false);
        }
    };
  

    // Create new card via API
    const createCard = async (listTitle: string, tasksCount: number) => {
        const cardTitle = newCardInputs[listTitle]?.trim();
        if (!cardTitle || !boardId) return;

        try {
            const newCard = await cardsService.create(
                boardId,
                cardTitle,
                "New card description",
                [listTitle],
                tasksCount,
            );
            setCards(prev => [...prev, newCard]);
            // Clear input and refresh cards
            setNewCardInputs(prev => ({ ...prev, [listTitle]: "" }));
        } catch (error) {
            console.error("Failed to create card:", error);
           
        }
    };

    // Delete card via API
    const deleteCard = async (cardId: string | undefined) => {
        if (!cardId || !boardId) return;

        try {
            await cardsService.delete(boardId, cardId);
            fetchCards(); // Refresh after delete
        } catch (error) {
            console.error("Failed to delete card:", error);
        }
    };
  const openTask = (cardId: string | undefined, cardName: string | undefined, listTitle: string | undefined) => async () => {
        if (!boardId || !cardId || !cardName || !listTitle) return;
        const tasks = await tasksService.getAll(boardId, cardId);
        console.log(tasks);
        try {
            await tasksService.create(
                boardId,
                cardId,
                cardName,
                "new",
                listTitle,
                [],
                [],
            );
        } catch (error) {
            
        }
        navigate(`/boards/${boardId}/cards/${cardId}/tasks/${tasks.tasks[0]?.id}`);
    };
    // Add new list
    const addList = async () => {
        const trimmedTitle = newListTitle.trim();
        if (!trimmedTitle) return;

        // Check if list already exists
        const listExists = lists.some(list => list.title === trimmedTitle);
        if (listExists) {
            alert("List with this name already exists!");
            return;
        }
        // Add new list to state
        setLists(prev => [...prev, { title: trimmedTitle, cards: [] }]);
        setNewListTitle("");
        setShowAddList(false);
    };

    function groupCardsByList(cards: Card[]): List[] {
        const map = new Map<string, Card[]>();

        cards.forEach((card) => {
            card.list_member.forEach((listName) => {
                if (!map.has(listName)) {
                    map.set(listName, []);
                }
                map.get(listName)!.push(card);
            });
        });

        return Array.from(map.entries()).map(([title, cards]) => ({
            title,
            cards,
        }));
    }
    useEffect(() => {
        fetchCards();
    }, [boardId]);

    // Update lists when cards change
    useEffect(() => {
        if (cards.length >= 0) {
            const updatedLists = groupCardsByList(cards);
            setLists(updatedLists);
        }
    }, [cards]);

    const handleDragEnd = async (result: DropResult) => {
        // xác định vị trí bd, kết thúc và đối tượng -> clone list cho an toàn -> xóa card cũ -> chèn vị trí mới ( nếu list khác thì thay đổi title)   
        const { source, destination, draggableId } = result;

        if (!destination) return;
        // Không thay đổi gì
        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        ) return;

        const updated = JSON.parse(JSON.stringify(lists));
        console.log(updated)
        const sourceListIndex = updated.findIndex(l => l.title === source.droppableId);
        const destListIndex = updated.findIndex(l => l.title === destination.droppableId);

        if (sourceListIndex === -1 || destListIndex === -1) return;

        // Lấy card bị kéo
        const [movedCard] = updated[sourceListIndex].cards.splice(source.index, 1);

        // Nếu sang list khác → cập nhật list_member
        if (sourceListIndex !== destListIndex) {
            movedCard.list_member = [updated[destListIndex].title];
        }

        // Chèn vào vị trí mới
        updated[destListIndex].cards.splice(destination.index, 0, movedCard);
        setLists(updated);

        try {
            if (!boardId) return;
            await cardsService.update(boardId, draggableId, {
                list_member: [updated[destListIndex].title],
            });
        } catch (error) {
            console.error("Failed to update card:", error);
        }
        //   
    };

    return (
        <div className="boards-container">
            <TopBar showAppsMenu={false} boardId={boardId} />
            <Sidebar type="cards" onClose={() => navigate("/boards")} />

            {/* Main content */}
            <div className="main-content ">
                <div className="board-header d-flex justify-content-between ">
                    <h5>My Trello board</h5>
                    <Invite boardId={boardId} />
                </div>
                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <div className="lists-container">
                            {lists.map((list, listIndex) => (
                                <Droppable droppableId={list.title} key={listIndex}>
                                    {(provided) => (
                                        <div className="list" ref={provided.innerRef} {...provided.droppableProps}>
                                            <div className="list-header">
                                                <h6>{list.title} ({list.cards.length})</h6>
                                            </div>

                                            {/* Display cards in this list */}
                                            {list.cards.map((card, cardIndex) => (

                                                <Draggable key={card.id ?? `temp-${cardIndex}`} draggableId={card.id ?? `temp-${cardIndex}`} index={cardIndex}>

                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            key={cardIndex}
                                                            className={`card card-wrapper ${snapshot.isDragging ? "dragging" : ""}`}

                                                            onClick={openTask(card.id,card.name,list.title)}
                                                            style={{ cursor: 'pointer', ...provided.draggableProps.style }}
                                                        >
                                                            <span>{card.name}</span>
                                                            <button
                                                                className="btn-delete btn "
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteCard(card.id);
                                                                }}
                                                            >
                                                                ❌
                                                            </button>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}

                                            {/* Add card input */}
                                            <div className="add-card-area">
                                                <textarea
                                                    placeholder="Enter a title for this card..."
                                                    value={newCardInputs[list.title] || ""}
                                                    onChange={(e) =>
                                                        setNewCardInputs(prev => ({
                                                            ...prev,
                                                            [list.title]: e.target.value,
                                                        }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            createCard(list.title, list.cards.length);
                                                        }
                                                    }}
                                                />
                                                <div className="add-card-actions">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => createCard(list.title, list.cards.length)}
                                                    >
                                                        Add card
                                                    </button>
                                                    <div
                                                        className="close"
                                                        onClick={() => {
                                                            setNewCardInputs(prev => {
                                                                const newInputs = { ...prev };
                                                                delete newInputs[list.title];
                                                                return newInputs;
                                                            });
                                                        }}
                                                    >
                                                        ✕
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Droppable>
                            ))}

                            {/* Add new list */}
                            <div className="add-list">
                                {!showAddList ? (
                                    <div
                                        className="add-list-btn"
                                        onClick={() => setShowAddList(true)}
                                    >
                                        + Add another list
                                    </div>
                                ) : (
                                    <div className="add-list-area">
                                        <input
                                            type="text"
                                            placeholder="Enter list title..."
                                            value={newListTitle}
                                            onChange={(e) => setNewListTitle(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") addList();
                                                if (e.key === "Escape") {
                                                    setShowAddList(false);
                                                    setNewListTitle("");
                                                }
                                            }}
                                            autoFocus
                                        />
                                        <div className="add-list-actions">
                                            <button
                                                className="btn btn-primary"
                                                onClick={addList}
                                            >
                                                Add list
                                            </button>
                                            <div
                                                className="close"
                                                onClick={() => {
                                                    setShowAddList(false);
                                                    setNewListTitle("");
                                                }}
                                            >
                                                ✕
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </DragDropContext>
                )}
            </div>
        </div>
    );
};

export default Cards;
