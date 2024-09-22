import AuthenticateUserUseCase from "@/domain/usecases/user/authenticate-user-usecase";
import UserRepository from "@/infrastructure/repositories/user-repository";
import FollowerRepository from "@/infrastructure/repositories/follower-repository";
import FollowUserUseCase from "@/domain/usecases/user/follow/follow-user-usecase";
import UnfollowUserUseCase from "@/domain/usecases/user/follow/unfollow-user-usecase";

export async function POST(request) {
	const { identifier, toFollowIdentifier } = await request.json();
	const authenticateUserUseCase = new AuthenticateUserUseCase();
	let gid;

	if (!identifier || !toFollowIdentifier)
		return Response.json({ error: "Missing required fields." }, { status: 400 });

	try {
		const accessGID = request.headers.get("Authorization");
		gid = await authenticateUserUseCase.execute(accessGID);
	} catch (error) {
		return Response.json({ error: error.message }, { status: 401 })
	}

	const userRepository = new UserRepository();
	const followerRepository = new FollowerRepository();
	const followUserUseCase = new FollowUserUseCase(userRepository, followerRepository);

	try {
		await followUserUseCase.execute({ gid, identifier, toFollowIdentifier });
		return Response.json({ message: "User followed successfully." }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error.message }, { status: 400 });
	}
}

export async function DELETE(request) {
	const { identifier, toFollowIdentifier } = await request.json();
	const authenticateUserUseCase = new AuthenticateUserUseCase();
	let gid;

	if (!identifier || !toFollowIdentifier)
		return Response.json({ error: "Missing required fields." }, { status: 400 });

	try {
		const accessGID = request.headers.get("Authorization");
		gid = await authenticateUserUseCase.execute(accessGID);
	} catch (error) {
		return Response.json({ error: error.message }, { status: 401 })
	}

	const userRepository = new UserRepository();
	const followerRepository = new FollowerRepository();
	const unfollowUserUseCase = new UnfollowUserUseCase(userRepository, followerRepository);

	try {
		await unfollowUserUseCase.execute({ gid, identifier, toFollowIdentifier });
		return Response.json({ message: "User unfollowed successfully." }, { status: 200 });
	} catch (error) {
		return Response.json({ error: error.message }, { status: 400 });
	}
}