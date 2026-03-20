
import { offlineStorage, DownloadTask } from './offlineStorage';
import { Workshop } from '../types';

class DownloadService {
  private activeDownloads: Map<string, AbortController> = new Map();

  async startCourseDownload(workshop: Workshop) {
    const taskId = `course_${workshop.id}`;
    const task: DownloadTask = {
      id: taskId,
      courseId: workshop.id,
      title: workshop.title,
      progress: 0,
      status: 'downloading',
      totalSize: 0,
      downloadedSize: 0,
    };

    await offlineStorage.updateDownloadTask(task);
    this.processDownload(workshop, task);
  }

  private async processDownload(workshop: Workshop, task: DownloadTask) {
    const controller = new AbortController();
    this.activeDownloads.set(task.id, controller);

    try {
      // 1. Save Course Metadata
      await offlineStorage.saveContent(workshop.id, 'course', workshop);
      
      const topics = workshop.workshop_structure?.topics || [];
      const mediaUrls: string[] = [];
      
      // Collect all media URLs from sections
      topics.forEach(t => {
        if (t.section_1?.video?.url) mediaUrls.push(t.section_1.video.url);
        if (t.section_2?.video?.url) mediaUrls.push(t.section_2.video.url);
        if (t.section_3?.video?.url) mediaUrls.push(t.section_3.video.url);
      });

      const totalSteps = topics.length + mediaUrls.length + 1;
      let completedSteps = 1;

      // 2. Download Topics/Lessons
      for (const topic of topics) {
        if (controller.signal.aborted) return;
        await offlineStorage.saveContent(`topic_${topic.id}`, 'lesson', topic);
        completedSteps++;
        this.updateTaskProgress(task, completedSteps, totalSteps);
      }

      // 3. Download Media Blobs
      const lowData = localStorage.getItem('low_data_mode') === 'true';
      
      for (const url of mediaUrls) {
        if (controller.signal.aborted) return;
        
        if (lowData) {
          console.log(`Low Data Mode: Skipping media download for ${url}`);
          completedSteps++;
          this.updateTaskProgress(task, completedSteps, totalSteps);
          continue;
        }

        try {
          // Attempt actual fetch (might fail due to CORS on external URLs)
          const response = await fetch(url, { 
            signal: controller.signal,
            mode: 'no-cors' // Use no-cors as a fallback, though it won't give us a readable blob
          });
          
          // Since we can't easily get blobs from cross-origin YouTube/Vimeo in a browser without a proxy
          // we simulate the data transfer for the demo, but in a real production app with a private CDN
          // this would be: const blob = await response.blob();
          
          // Simulation of data transfer
          await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
          
          const mockBlob = new Blob(["Simulated Video Data"], { type: 'video/mp4' });
          await offlineStorage.saveContent(url, 'media', { url }, mockBlob);
          
          task.totalSize += 5 * 1024 * 1024; // Assume 5MB per video
          task.downloadedSize += 5 * 1024 * 1024;
        } catch (err) {
          console.warn(`Failed to download media from ${url}, skipping...`, err);
        }

        completedSteps++;
        this.updateTaskProgress(task, completedSteps, totalSteps);
      }

      task.status = 'completed';
      task.progress = 100;
      await offlineStorage.updateDownloadTask(task);
    } catch (error) {
      console.error('Download failed', error);
      task.status = 'error';
      await offlineStorage.updateDownloadTask(task);
    } finally {
      this.activeDownloads.delete(task.id);
    }
  }

  private async updateTaskProgress(task: DownloadTask, completed: number, total: number) {
    task.progress = Math.round((completed / total) * 100);
    await offlineStorage.updateDownloadTask(task);
  }

  pauseDownload(taskId: string) {
    const controller = this.activeDownloads.get(taskId);
    if (controller) {
      controller.abort();
      this.activeDownloads.delete(taskId);
    }
  }

  async resumeDownload(taskId: string) {
    const tasks = await offlineStorage.getDownloadTasks();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'downloading';
      await offlineStorage.updateDownloadTask(task);
      // In a real app, we'd fetch the workshop and resume
    }
  }

  async removeDownload(courseId: string) {
    await offlineStorage.deleteContent(courseId);
    await offlineStorage.deleteDownloadTask(`course_${courseId}`);
    // Also delete topics and media...
  }
}

export const downloadService = new DownloadService();
