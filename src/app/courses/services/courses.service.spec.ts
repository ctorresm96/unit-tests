import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";
import { LoggerService } from "./logger.service";

describe("Courses Service", () => {
  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;
  let loggerSpy: any;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj("LoggerService", ["log"]);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it("Should retrieve all courses", () => {
    coursesService.findAllCourses().subscribe((courses) => {
      expect(courses).toBeTruthy();
      expect(courses.length).toBe(12, "Inconrrect number");
      const course = courses.find((c) => c.id === 12);
      expect(course.titles.description).toBe("Angular Testing Course");
    });

    const req = httpTestingController.expectOne("/api/courses");
    expect(req.request.method).toEqual("GET");
    req.flush({ payload: Object.values(COURSES) });
  });

  it("Should find a course by id", () => {
    coursesService.findCourseById(12).subscribe((course) => {
      expect(course).toBeTruthy();
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("GET");
    req.flush(COURSES[12]);
  });

  it("Should save the course data", () => {
    const changes: Partial<Course> = {
      titles: { description: "Testing Course" },
    };

    coursesService.saveCourse(12, changes).subscribe((course) => {
      expect(course.id).toBe(12);
    });

    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    expect(req.request.body.titles.description).toEqual(
      changes.titles.description
    );
    req.flush({
      ...COURSES[12],
      ...changes,
    });
  });

  it("should give an eror if save course fails", () => {
    const changes: Partial<Course> = {
      titles: { description: "testing curseee" },
    };
    coursesService.saveCourse(12, changes).subscribe(
      () => {
        fail("the save course op should have failed");
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(500);
      }
    );
    const req = httpTestingController.expectOne("/api/courses/12");
    expect(req.request.method).toEqual("PUT");
    req.flush("Save Course Failed", {
      status: 500,
      statusText: "Internal Servier Error",
    });
  });

  it("Should find a list of lessons", () => {
    coursesService.findLessons(12).subscribe((lessons) => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3);
    });
    const courseId = "12";
    const filter = "";
    const sortOrder = "asc";
    const pageSize = "3";
    const req = httpTestingController.expectOne(
      `/api/lessons?courseId=${courseId}&filter=${filter}&sortOrder=${sortOrder}&pageNumber=0&pageSize=${pageSize}`
    );
    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3),
    });
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
