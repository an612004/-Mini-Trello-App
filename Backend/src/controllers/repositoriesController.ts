import { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import db from "../config/firebaseConfig";
import { arrayRemove, arrayUnion, collection, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { docTaskId } from "./taskController"


class GitHubController {
  //--get    repositories/:repositoryId/github-info 
  async getRepoInfo(req: Request, res: Response) {
    const link = "https://api.github.com";
    try {
      const fetchRepo = await fetch(`${link}/repos/Vanqui123z/Trello_mini_app`);
      const datarepo = await fetchRepo.json();
      const repositoryId = datarepo.id;


      // Fetch song song
      const [branchesRes, pullsRes, issuesRes, commitsRes] = await Promise.all([
        fetch(`${link}/repositories/${repositoryId}/branches`),
        fetch(`${link}/repositories/${repositoryId}/pulls`),
        fetch(`${link}/repositories/${repositoryId}/issues`),
        fetch(`${link}/repositories/${repositoryId}/commits`)
      ]);

      const [branches, pulls, issues, commits] = await Promise.all([
        branchesRes.json(),
        pullsRes.json(),
        issuesRes.json(),
        commitsRes.json()
      ]);

      const dataGithud = {
        repositoryId,
        branches: branches.map((b: any) => ({
          name: b.name,
          lastCommitSha: b.commit?.sha
        })),
        pulls: pulls.map((p: any) => ({
          title: p.title,
          pullNumber: p.number
        })),
        issues: issues.map((i: any) => ({
          title: i.title,
          issueNumber: i.number
        })),
        commits: commits.map((c: any) => ({
          sha: c.sha,
          message: c.commit?.message
        }))
      };
      return res.status(200).json({ dataGithud });


    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch data from GitHub" });
    }
  }

  //  attach `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attach`
  async attachToTask(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      const { type, number, sha } = req.body;

      const attachmentId = uuid();
      const attachment = {
        attachmentId,
        type,
        ...(type === "commit" ? { sha } : { number }),
      };
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }
      const taskRef = docTaskId(boardId, cardId, taskId);
      await updateDoc(taskRef, { attachGithud: arrayUnion(attachment) });

      return res.status(201).json({ taskId, ...attachment });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  // getList `/boards/:boardId/cards/:cardId/tasks/:taskId/github-attachments
  async getAttachments(req: Request, res: Response) {
    try {
      const { boardId, cardId, taskId } = req.params;
      if (!boardId || !cardId || !taskId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }
      const taskRef = docTaskId(boardId, cardId, taskId);
      const attachRef = await getDoc(taskRef);
      const dataAttachGit = attachRef.data();
      if (!dataAttachGit) { return res.status(500).json("dataAttachGit not found!"); }
      return res.json({ dataAttachGit: dataAttachGit.attachGithud })
    } catch (error) {
      return res.status(500).json(error);
    }

  }

 
  async deleteAttachment(req: Request, res: Response) {

    try {
      const { boardId, cardId, taskId, attachmentId } = req.params;
      if (!boardId || !cardId || !taskId || !attachmentId) {
        return res.status(400).json({ status: "failed", message: "Missing params" });
      }
      const taskRef = docTaskId(boardId, cardId, taskId);
      await updateDoc(taskRef, { dataAttachGit:arrayRemove({attachmentId})})

      return res.json({message:"deleted!"})
    } catch (error) {
      return res.status(500).json(error);
    }


  }
}

export default new GitHubController();
