package marketplace.sensis.app.user;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
	@Autowired
	private UserRepository userRepository;
	
	public User addUser(User user) {
		if (!existsByWalletAddress(user.getWalletAddress())) {
			return userRepository.save(user);
		}
		else {
			return new User();
		}
	}
	
	public Optional<User> getUserByWalletAddress(String walletAddress) {
		return userRepository.findByWalletAddress(walletAddress);
	}
	
	public List<User> getUsers() {
		return (List<User>) userRepository.findAll();
	}
	
	public void deleteByWalletAddress(String address) {
		userRepository.deleteByWalletAddress(address);
	}
	
	private boolean existsByWalletAddress(String walletAddress) {
		return userRepository.existsByWalletAddress(walletAddress);
	}
}
