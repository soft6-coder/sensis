package marketplace.sensis.app.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
	@Autowired
	private UserService userService;
	
	@CrossOrigin(maxAge = 3600)
	@RequestMapping(method = RequestMethod.POST, value = "/user")
	public User addUser(@RequestBody User user) {
		return userService.addUser(user);
	}
	
	@CrossOrigin(maxAge = 3600)
	@RequestMapping(method = RequestMethod.PUT, value= "/user")
	public User updateUser(@RequestBody User user) {
		return userService.addUser(user);
	}
	@CrossOrigin(maxAge = 3600)
	@RequestMapping("/user/{walletAddress}")
	public Optional<User> getUserByWalletAddress(@PathVariable String walletAddress) {
		System.out.println(walletAddress);
		return userService.getUserByWalletAddress(walletAddress);
	}
	
	@RequestMapping("/users")
	public List<User> getUsers() {
		return userService.getUsers();
	}
	
	@RequestMapping("/user/{walletAddress}/delete")
	public void deleteByWalletAddress(@PathVariable String walletAddress) {
		userService.deleteByWalletAddress(walletAddress);
	}
}
