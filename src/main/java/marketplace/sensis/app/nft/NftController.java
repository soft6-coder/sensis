package marketplace.sensis.app.nft;

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
public class NftController {
	@Autowired
	private NftService nftService;
	
	@RequestMapping(method = RequestMethod.POST, value="/nft")
	public Nft addNft(@RequestBody Nft nft) {
		return nftService.addNft(nft);
	}
	@CrossOrigin(maxAge = 3600)
	@RequestMapping("/nft/{token}")
	public Optional<Nft> getNft(@PathVariable String token) {
		return nftService.getNftByToken(token);
	}
	@CrossOrigin(maxAge = 3600)
	@RequestMapping("/nft/user/{walletAddress}/{status}")
	public List<Nft> getNftsByOwnerAndStatus(@PathVariable String walletAddress, @PathVariable String status) {
		return nftService.getNftsByOwnerAndStatus(walletAddress, status);
	}
	
	@RequestMapping("/nfts")
	public List<Nft> getNfts() {
		return nftService.getNfts();
	}
}
