class UserDto{

    id;
    name;
    username;
    email;
    image;

    constructor(user)
    {
        this.id = user._id,
        this.name = user.name,
        this.username = user.username,
        this.email = user.email,
        this.image = user.image
    }

}

module.exports = UserDto;