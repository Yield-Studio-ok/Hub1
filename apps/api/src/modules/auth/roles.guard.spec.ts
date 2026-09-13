import { ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RolesGuard } from "./roles.guard";

// Use string literals to avoid Prisma client import issues in tests
const FOUNDER = "FOUNDER";
const PM = "PM";
const DEVELOPER = "DEVELOPER";

describe("RolesGuard", () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createMockContext(userRole?: string): ExecutionContext {
    return {
      getHandler: () => jest.fn(),
      getClass: () => jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({
          user: userRole ? { uid: "1", email: "test@test.com", role: userRole } : undefined,
        }),
      }),
    } as unknown as ExecutionContext;
  }

  it("should allow access when no @Roles decorator is present", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(undefined);
    const context = createMockContext(DEVELOPER);

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should allow access when user has required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([FOUNDER]);
    const context = createMockContext(FOUNDER);

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should deny access when user does not have required role", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([FOUNDER]);
    const context = createMockContext(DEVELOPER);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it("should allow access when user has one of multiple required roles", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([FOUNDER, PM]);
    const context = createMockContext(PM);

    expect(guard.canActivate(context)).toBe(true);
  });

  it("should throw ForbiddenException when no user is present", () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue([FOUNDER]);
    const context = createMockContext();

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
